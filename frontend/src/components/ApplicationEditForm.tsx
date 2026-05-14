import { FormEvent } from 'react';
import type { JobApplication, ApplicationStatus, WorkplaceType } from '../types';

const STATUSES: ApplicationStatus[] = [
  'APPLIED', 'RECRUITER_SCREEN', 'TECHNICAL_INTERVIEW', 'FINAL_INTERVIEW',
  'OFFER', 'REJECTED', 'WITHDRAWN',
];
const WORKPLACES: WorkplaceType[] = ['REMOTE', 'HYBRID', 'ON_SITE'];

interface Props {
  form: Partial<JobApplication>;
  error: string;
  onField: (key: keyof JobApplication, value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function ApplicationEditForm({ form, error, onField, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit}>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Company *</label>
          <input
            className="form-control"
            value={form.company ?? ''}
            onChange={(e) => onField('company', e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Role Title *</label>
          <input
            className="form-control"
            value={form.roleTitle ?? ''}
            onChange={(e) => onField('roleTitle', e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.status ?? ''}
            onChange={(e) => onField('status', e.target.value)}
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Applied Date</label>
          <input
            type="date"
            className="form-control"
            value={form.appliedDate ?? ''}
            onChange={(e) => onField('appliedDate', e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Workplace Type</label>
          <select
            className="form-select"
            value={form.workplaceType ?? ''}
            onChange={(e) => onField('workplaceType', e.target.value)}
          >
            <option value="">—</option>
            {WORKPLACES.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Location</label>
          <input
            className="form-control"
            value={form.location ?? ''}
            onChange={(e) => onField('location', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Salary Range</label>
          <input
            className="form-control"
            value={form.salaryRange ?? ''}
            onChange={(e) => onField('salaryRange', e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Job Posting URL</label>
          <input
            type="url"
            className="form-control"
            value={form.jobPostingUrl ?? ''}
            onChange={(e) => onField('jobPostingUrl', e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={2}
            value={form.description ?? ''}
            onChange={(e) => onField('description', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Applicant Name</label>
          <input
            className="form-control"
            placeholder="e.g. Jane Smith"
            value={form.applicantName ?? ''}
            onChange={(e) => onField('applicantName', e.target.value)}
          />
        </div>
      </div>
      <button className="btn btn-primary mt-3" type="submit">
        Save Changes
      </button>
    </form>
  );
}
