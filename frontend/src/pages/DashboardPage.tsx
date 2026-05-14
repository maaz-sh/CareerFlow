import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { JobApplication, Page, ApplicationStatus, WorkplaceType } from '../types';

const STATUSES: ApplicationStatus[] = [
  'APPLIED', 'RECRUITER_SCREEN', 'TECHNICAL_INTERVIEW', 'FINAL_INTERVIEW',
  'OFFER', 'REJECTED', 'WITHDRAWN',
];

const STATUS_BADGE: Record<ApplicationStatus, string> = {
  APPLIED: 'primary',
  RECRUITER_SCREEN: 'info',
  TECHNICAL_INTERVIEW: 'warning',
  FINAL_INTERVIEW: 'warning',
  OFFER: 'success',
  REJECTED: 'danger',
  WITHDRAWN: 'secondary',
};

const WORKPLACES: WorkplaceType[] = ['REMOTE', 'HYBRID', 'ON_SITE'];

const EMPTY_FORM = {
  company: '',
  roleTitle: '',
  status: 'APPLIED' as ApplicationStatus,
  appliedDate: new Date().toISOString().split('T')[0],
  location: '',
  workplaceType: '' as WorkplaceType | '',
  salaryRange: '',
  jobPostingUrl: '',
  description: '',
  applicantName: '',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<Page<JobApplication> | null>(null);
  const [loadError, setLoadError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterStatus, filterCompany]);

  async function loadApplications() {
    setLoadError('');
    try {
      const params: Record<string, string | number> = { page: currentPage, size: 20 };
      if (filterStatus) params.status = filterStatus;
      if (filterCompany) params.company = filterCompany;
      const { data } = await client.get<Page<JobApplication>>('/applications', { params });
      setPage(data);
    } catch (err: unknown) {
      const status =
        err instanceof Error && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      setLoadError(
        status === 401 || status === 403
          ? 'Your session has expired. Please log in again.'
          : 'Could not load applications. Check your connection and try again.',
      );
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        workplaceType: form.workplaceType || undefined,
        location: form.location || undefined,
        salaryRange: form.salaryRange || undefined,
        jobPostingUrl: form.jobPostingUrl || undefined,
        description: form.description || undefined,
      };
      await client.post('/applications', payload);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setCurrentPage(0);
      loadApplications();
    } catch (err: unknown) {
      const message =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setFormError(message ?? 'Failed to create application.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this application and all its interviews, contacts and notes?')) return;
    try {
      await client.delete(`/applications/${id}`);
    } catch {
      // deletion errors are rare; re-load to reflect true state either way
    }
    loadApplications();
  }

  async function handleStatusChange(app: JobApplication, newStatus: ApplicationStatus) {
    try {
      await client.put(`/applications/${app.id}`, {
        company: app.company,
        roleTitle: app.roleTitle,
        status: newStatus,
        appliedDate: app.appliedDate,
        location: app.location,
        workplaceType: app.workplaceType,
        salaryRange: app.salaryRange,
        jobPostingUrl: app.jobPostingUrl,
        description: app.description,
        applicantName: app.applicantName,
      });
      loadApplications();
    } catch {
      // silently re-load; user will see the original status restored
      loadApplications();
    }
  }

  function field(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">My Applications</h3>
        <button className="btn btn-success" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New Application'}
        </button>
      </div>

      {/* ── New Application Form ── */}
      {showForm && (
        <div className="card mb-4 border-success">
          <div className="card-header bg-success text-white">New Application</div>
          <div className="card-body">
            {formError && <div className="alert alert-danger py-2">{formError}</div>}
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Company *</label>
                  <input className="form-control" value={form.company} onChange={(e) => field('company', e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Role Title *</label>
                  <input className="form-control" value={form.roleTitle} onChange={(e) => field('roleTitle', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={(e) => field('status', e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Applied Date</label>
                  <input type="date" className="form-control" value={form.appliedDate} onChange={(e) => field('appliedDate', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Workplace Type</label>
                  <select className="form-select" value={form.workplaceType} onChange={(e) => field('workplaceType', e.target.value)}>
                    <option value="">—</option>
                    {WORKPLACES.map((w) => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input className="form-control" value={form.location} onChange={(e) => field('location', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Salary Range</label>
                  <input className="form-control" placeholder="e.g. $90k–$120k" value={form.salaryRange} onChange={(e) => field('salaryRange', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Job Posting URL</label>
                  <input type="url" className="form-control" placeholder="https://" value={form.jobPostingUrl} onChange={(e) => field('jobPostingUrl', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description / Notes</label>
                  <textarea className="form-control" rows={2} value={form.description} onChange={(e) => field('description', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Applicant Name</label>
                  <input className="form-control" placeholder="e.g. Jane Smith" value={form.applicantName} onChange={(e) => field('applicantName', e.target.value)} />
                </div>
              </div>
              <button className="btn btn-success mt-3" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <select className="form-select form-select-sm" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(0); }}>
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <input
            className="form-control form-control-sm"
            placeholder="Filter by company…"
            value={filterCompany}
            onChange={(e) => { setFilterCompany(e.target.value); setCurrentPage(0); }}
          />
        </div>
      </div>

      {/* ── Applications Table ── */}
      {loadError ? (
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <span>{loadError}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={loadApplications}>Retry</button>
        </div>
      ) : !page ? (
        <div className="text-center py-5 text-muted">Loading…</div>
      ) : page.content.length === 0 ? (
        <div className="text-center py-5 text-muted">No applications yet. Add one above!</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Applicant</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Workplace</th>
                  <th>Salary</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {page.content.map((app) => (
                  <tr key={app.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/applications/${app.id}`)}>
                    <td>{app.applicantName ?? '—'}</td>
                    <td className="fw-semibold">{app.company}</td>
                    <td>{app.roleTitle}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className={`form-select form-select-sm border-0 bg-transparent fw-semibold text-${STATUS_BADGE[app.status]}`}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                        style={{ minWidth: 160 }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td>{app.appliedDate}</td>
                    <td>{app.workplaceType?.replace(/_/g, ' ') ?? '—'}</td>
                    <td>{app.salaryRange ?? '—'}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(app.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {page.totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
                </li>
                {Array.from({ length: page.totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === page.totalPages - 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          )}
          <p className="text-muted text-center small">{page.totalElements} total application{page.totalElements !== 1 ? 's' : ''}</p>
        </>
      )}
    </div>
  );
}
