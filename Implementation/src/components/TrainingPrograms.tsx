import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, X, Users } from 'lucide-react';
import type { Database } from '../lib/database.types';

type TrainingProgram = Database['public']['Tables']['training_programs']['Row'];
type TrainingProgramInsert =
  Database['public']['Tables']['training_programs']['Insert'];
type TrainingEnrollment =
  Database['public']['Tables']['training_enrollments']['Row'];
type TrainingEnrollmentInsert =
  Database['public']['Tables']['training_enrollments']['Insert'];
type Student = Database['public']['Tables']['students']['Row'];

interface EnrollmentWithStudent extends TrainingEnrollment {
  students?: Student;
}

export function TrainingPrograms() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithStudent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(
    null
  );
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(
    null
  );
  const [programFormData, setProgramFormData] = useState<TrainingProgramInsert>({
    title: '',
    trainer_name: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  const [enrollmentFormData, setEnrollmentFormData] =
    useState<TrainingEnrollmentInsert>({
      student_id: '',
      training_id: '',
      attendance_percentage: 0,
      completion_status: 'Enrolled',
    });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [programsResult, enrollmentsResult, studentsResult] =
      await Promise.all([
        supabase
          .from('training_programs')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('training_enrollments')
          .select('*, students(*)')
          .order('created_at', { ascending: false }),
        supabase.from('students').select('*').order('name'),
      ]);

    if (programsResult.error) {
      console.error('Error fetching programs:', programsResult.error);
    } else {
      setPrograms(programsResult.data || []);
    }

    if (enrollmentsResult.error) {
      console.error('Error fetching enrollments:', enrollmentsResult.error);
    } else {
      setEnrollments(enrollmentsResult.data || []);
    }

    if (studentsResult.error) {
      console.error('Error fetching students:', studentsResult.error);
    } else {
      setStudents(studentsResult.data || []);
    }

    setLoading(false);
  };

  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProgram) {
      const { error } = await supabase
        .from('training_programs')
        .update(programFormData)
        .eq('id', editingProgram.id);

      if (error) {
        console.error('Error updating program:', error);
        alert('Error updating program');
      } else {
        alert('Program updated successfully!');
      }
    } else {
      const { error } = await supabase
        .from('training_programs')
        .insert([programFormData]);

      if (error) {
        console.error('Error creating program:', error);
        alert('Error creating program');
      } else {
        alert('Program created successfully!');
      }
    }

    resetProgramForm();
    fetchData();
  };

  const handleEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('training_enrollments')
      .insert([enrollmentFormData]);

    if (error) {
      console.error('Error enrolling student:', error);
      alert('Error enrolling student. Student may already be enrolled.');
    } else {
      alert('Student enrolled successfully!');
    }

    resetEnrollmentForm();
    fetchData();
  };

  const handleEditProgram = (program: TrainingProgram) => {
    setEditingProgram(program);
    setProgramFormData({
      title: program.title,
      trainer_name: program.trainer_name,
      start_date: program.start_date,
      end_date: program.end_date,
      description: program.description,
    });
    setShowProgramForm(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    const { error } = await supabase
      .from('training_programs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting program:', error);
      alert('Error deleting program');
    } else {
      alert('Program deleted successfully!');
      fetchData();
    }
  };

  const handleViewEnrollments = (program: TrainingProgram) => {
    setSelectedProgram(program);
  };

  const resetProgramForm = () => {
    setProgramFormData({
      title: '',
      trainer_name: '',
      start_date: '',
      end_date: '',
      description: '',
    });
    setEditingProgram(null);
    setShowProgramForm(false);
  };

  const resetEnrollmentForm = () => {
    setEnrollmentFormData({
      student_id: '',
      training_id: '',
      attendance_percentage: 0,
      completion_status: 'Enrolled',
    });
    setShowEnrollmentForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading training programs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Training Programs</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEnrollmentForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Users size={20} />
            Enroll Student
          </button>
          <button
            onClick={() => setShowProgramForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Program
          </button>
        </div>
      </div>

      {showProgramForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProgram ? 'Edit Training Program' : 'Add New Program'}
              </h3>
              <button
                onClick={resetProgramForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleProgramSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={programFormData.title}
                  onChange={(e) =>
                    setProgramFormData({
                      ...programFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trainer Name *
                </label>
                <input
                  type="text"
                  required
                  value={programFormData.trainer_name}
                  onChange={(e) =>
                    setProgramFormData({
                      ...programFormData,
                      trainer_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={programFormData.start_date}
                    onChange={(e) =>
                      setProgramFormData({
                        ...programFormData,
                        start_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={programFormData.end_date}
                    onChange={(e) =>
                      setProgramFormData({
                        ...programFormData,
                        end_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={programFormData.description || ''}
                  onChange={(e) =>
                    setProgramFormData({
                      ...programFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </button>
                <button
                  type="button"
                  onClick={resetProgramForm}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEnrollmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Enroll Student in Training Program
              </h3>
              <button
                onClick={resetEnrollmentForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEnrollmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student *
                </label>
                <select
                  required
                  value={enrollmentFormData.student_id}
                  onChange={(e) =>
                    setEnrollmentFormData({
                      ...enrollmentFormData,
                      student_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.roll_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Training Program *
                </label>
                <select
                  required
                  value={enrollmentFormData.training_id}
                  onChange={(e) =>
                    setEnrollmentFormData({
                      ...enrollmentFormData,
                      training_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.title} - {program.trainer_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Enroll Student
                </button>
                <button
                  type="button"
                  onClick={resetEnrollmentForm}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Enrollments: {selectedProgram.title}
              </h3>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Roll No
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Attendance
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments
                    .filter((e) => e.training_id === selectedProgram.id)
                    .map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {enrollment.students?.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {enrollment.students?.roll_number}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {enrollment.attendance_percentage}%
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              enrollment.completion_status
                            )}`}
                          >
                            {enrollment.completion_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {enrollments.filter((e) => e.training_id === selectedProgram.id)
                .length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No enrollments for this program yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  {program.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Trainer: {program.trainer_name}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(program.start_date).toLocaleDateString()} -{' '}
                  {new Date(program.end_date).toLocaleDateString()}
                </p>
                {program.description && (
                  <p className="text-sm text-gray-500 mt-2">
                    {program.description}
                  </p>
                )}
                <div className="mt-3">
                  <span className="text-sm text-gray-600">
                    Enrolled Students:{' '}
                    {
                      enrollments.filter((e) => e.training_id === program.id)
                        .length
                    }
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleViewEnrollments(program)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Users size={20} />
                </button>
                <button
                  onClick={() => handleEditProgram(program)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteProgram(program.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            No training programs found. Add your first program to get started.
          </p>
        </div>
      )}
    </div>
  );
}
