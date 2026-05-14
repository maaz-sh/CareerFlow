import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import type { JobApplication, ApplicationStatus } from '../types';
import ApplicationEditForm from '../components/ApplicationEditForm';
import InterviewsTab from '../components/InterviewsTab';
import ContactsTab from '../components/ContactsTab';
import NotesTab from '../components/NotesTab';

const STATUSES: ApplicationStatus[] = [
  'APPLIED', 'RECRUITER_SCREEN', 'TECHNICAL_INTERVIEW', 'FINAL_INTERVIEW',
  'OFFER', 'REJECTED', 'WITHDRAWN',
];

type Tab = 'interviews' | 'contacts' | 'notes';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<JobApplication | null>(null);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<JobApplication>>({});
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('interviews');

  useEffect(() => { loadApp(); }, []);

  async function loadApp() {
    setLoadError('');
    try {
      const { data } = await client.get<JobApplication>(`/applications/${id}`);
      setApp(data);
      setForm(data);
    } catch (err: unknown) {
      const status =
        err instanceof Error && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      setLoadError(
        status === 401 || status === 403
          ? 'Your session has expired. Please log in again.'
          : status === 404
          ? 'Application not found.'
          : 'Could not load application. Check your connection and try again.',
      );
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaveError('');
    try {
      const { data } = await client.put<JobApplication>(`/applications/${id}`, {
        company: form.company,
        roleTitle: form.roleTitle,
        status: form.status,
        appliedDate: form.appliedDate,
        location: form.location || undefined,
        workplaceType: form.workplaceType || undefined,
        salaryRange: form.salaryRange || undefined,
        jobPostingUrl: form.jobPostingUrl || undefined,
        description: form.description || undefined,
      });
      setApp(data);
      setEditing(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setSaveError(msg ?? 'Failed to save.');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this application and all its data?')) return;
    await client.delete(`/applications/${id}`);
    navigate('/dashboard');
  }

  function handleField(key: keyof JobApplication, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleStatusChange(newStatus: ApplicationStatus) {
    if (!app) return;
    try {
      const { data } = await client.put<JobApplication>(`/applications/${id}`, {
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
      setApp(data);
      setForm(data);
    } catch {
      // re-load to restore accurate state on failure
      loadApp();
    }
  }

  if (loadError)
    return (
      <div className="container my-4">
        <Link to="/dashboard" className="btn btn-sm btn-outline-secondary mb-3">&larr; Back</Link>
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <span>{loadError}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={loadApp}>Retry</button>
        </div>
      </div>
    );

  if (!app) return <div className="text-center py-5 text-muted">Loading…</div>;

  return (
    <div className="container my-4">
      <Link to="/dashboard" className="btn btn-sm btn-outline-secondary mb-3">
        &larr; Back
      </Link>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5">{app.company} &mdash; {app.roleTitle}</span>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setEditing((s) => !s)}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
        <div className="card-body">
          {editing ? (
            <ApplicationEditForm
              form={form}
              error={saveError}
              onField={handleField}
              onSubmit={handleSave}
            />
          ) : (
            <dl className="row mb-0">
              <dt className="col-sm-3">Status</dt>
              <dd className="col-sm-9">
                <select
                  className="form-select form-select-sm w-auto"
                  value={app.status}
                  onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </dd>
              <dt className="col-sm-3">Applied</dt>
              <dd className="col-sm-9">{app.appliedDate}</dd>
              <dt className="col-sm-3">Location</dt>
              <dd className="col-sm-9">{app.location ?? '—'}</dd>
              <dt className="col-sm-3">Workplace</dt>
              <dd className="col-sm-9">{app.workplaceType?.replace(/_/g, ' ') ?? '—'}</dd>
              <dt className="col-sm-3">Salary</dt>
              <dd className="col-sm-9">{app.salaryRange ?? '—'}</dd>
              <dt className="col-sm-3">Applicant</dt>
              <dd className="col-sm-9">{app.applicantName ?? '—'}</dd>
              {app.jobPostingUrl && (
                <>
                  <dt className="col-sm-3">Posting</dt>
                  <dd className="col-sm-9">
                    <a href={app.jobPostingUrl} target="_blank" rel="noopener noreferrer">
                      View Job
                    </a>
                  </dd>
                </>
              )}
              {app.description && (
                <>
                  <dt className="col-sm-3">Description</dt>
                  <dd className="col-sm-9">{app.description}</dd>
                </>
              )}
            </dl>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        {(['interviews', 'contacts', 'notes'] as Tab[]).map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link text-capitalize ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {id && activeTab === 'interviews' && <InterviewsTab appId={id} />}
      {id && activeTab === 'contacts' && <ContactsTab appId={id} />}
      {id && activeTab === 'notes' && <NotesTab appId={id} />}
    </div>
  );
}
