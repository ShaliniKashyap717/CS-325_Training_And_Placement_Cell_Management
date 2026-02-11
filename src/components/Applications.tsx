import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];
type Student = Database['public']['Tables']['students']['Row'];
type JobProfile = Database['public']['Tables']['job_profiles']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];

interface ApplicationWithDetails extends Application {
  students?: Student;
  job_profiles?: JobProfile & {
    companies?: Company;
  };
}

export function Applications() {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [jobProfiles, setJobProfiles] = useState<
    (JobProfile & { companies?: Company })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [formData, setFormData] = useState<ApplicationInsert>({
    student_id: '',
    job_id: '',
    application_status: 'Applied',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [appsResult, studentsResult, jobsResult] = await Promise.all([
      supabase
        .from('applications')
        .select('*, students(*), job_profiles(*, companies(*))')
        .order('created_at', { ascending: false }),
      supabase.from('students').select('*').order('name'),
      supabase.from('job_profiles').select('*, companies(*)').order('role'),
    ]);

    if (appsResult.error) {
      console.error('Error fetching applications:', appsResult.error);
    } else {
      setApplications(appsResult.data || []);
    }

    if (studentsResult.error) {
      console.error('Error fetching students:', studentsResult.error);
    } else {
      setStudents(studentsResult.data || []);
    }

    if (jobsResult.error) {
      console.error('Error fetching job profiles:', jobsResult.error);
    } else {
      setJobProfiles(jobsResult.data || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingApp) {
      const { error } = await supabase
        .from('applications')
        .update({ application_status: formData.application_status })
        .eq('id', editingApp.id);

      if (error) {
        console.error('Error updating application:', error);
        alert('Error updating application');
      } else {
        alert('Application updated successfully!');
      }
    } else {
      const { error } = await supabase.from('applications').insert([formData]);

      if (error) {
        console.error('Error creating application:', error);
        alert('Error creating application. Student may have already applied for this job.');
      } else {
        alert('Application created successfully!');
      }
    }

    resetForm();
    fetchData();
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setFormData({
      student_id: app.student_id,
      job_id: app.job_id,
      application_status: app.application_status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    const { error } = await supabase.from('applications').delete().eq('id', id);

    if (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application');
    } else {
      alert('Application deleted successfully!');
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      job_id: '',
      application_status: 'Applied',
    });
    setEditingApp(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Shortlisted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Selected':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Applications</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Application
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingApp ? 'Update Application' : 'New Application'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student *
                </label>
                <select
                  required
                  disabled={!!editingApp}
                  value={formData.student_id}
                  onChange={(e) =>
                    setFormData({ ...formData, student_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.roll_number}) - CGPA: {student.cgpa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Profile *
                </label>
                <select
                  required
                  disabled={!!editingApp}
                  value={formData.job_id}
                  onChange={(e) =>
                    setFormData({ ...formData, job_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Job Profile</option>
                  {jobProfiles.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.companies?.company_name} - {job.role} ({job.package} LPA)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Status *
                </label>
                <select
                  required
                  value={formData.application_status}
                  onChange={(e) =>
                    setFormData({ ...formData, application_status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingApp ? 'Update Application' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.students?.name}
                    <br />
                    <span className="text-xs text-gray-500">
                      {app.students?.roll_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.job_profiles?.companies?.company_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.job_profiles?.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.job_profiles?.package} LPA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        app.application_status
                      )}`}
                    >
                      {app.application_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.application_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(app)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No applications found. Create your first application to get started.
          </div>
        )}
      </div>
    </div>
  );
}