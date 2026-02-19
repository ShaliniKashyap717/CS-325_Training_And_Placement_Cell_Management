import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  totalStudents: number;
  totalCompanies: number;
  totalJobProfiles: number;
  totalApplications: number;
  totalTrainingPrograms: number;
  placedStudents: number;
  averagePackage: number;
  topBranch: string;
}

interface ApplicationStatus {
  status: string;
  count: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobProfiles: 0,
    totalApplications: 0,
    totalTrainingPrograms: 0,
    placedStudents: 0,
    averagePackage: 0,
    topBranch: '',
  });
  const [applicationStats, setApplicationStats] = useState<ApplicationStatus[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    const [
      studentsResult,
      companiesResult,
      jobProfilesResult,
      applicationsResult,
      trainingProgramsResult,
      placedResult,
      avgPackageResult,
      branchResult,
      applicationStatsResult,
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase
        .from('job_profiles')
        .select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase
        .from('training_programs')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('applications')
        .select('student_id', { count: 'exact', head: true })
        .eq('application_status', 'Selected'),
      supabase.from('job_profiles').select('package'),
      supabase.from('students').select('branch'),
      supabase.from('applications').select('application_status'),
    ]);

    const newStats: Stats = {
      totalStudents: studentsResult.count || 0,
      totalCompanies: companiesResult.count || 0,
      totalJobProfiles: jobProfilesResult.count || 0,
      totalApplications: applicationsResult.count || 0,
      totalTrainingPrograms: trainingProgramsResult.count || 0,
      placedStudents: placedResult.count || 0,
      averagePackage: 0,
      topBranch: '',
    };

    if (avgPackageResult.data && avgPackageResult.data.length > 0) {
      const total = avgPackageResult.data.reduce(
        (sum, job) => sum + job.package,
        0
      );
      newStats.averagePackage = total / avgPackageResult.data.length;
    }

    if (branchResult.data && branchResult.data.length > 0) {
      const branchCounts: Record<string, number> = {};
      branchResult.data.forEach((student) => {
        branchCounts[student.branch] =
          (branchCounts[student.branch] || 0) + 1;
      });
      const topBranchEntry = Object.entries(branchCounts).sort(
        (a, b) => b[1] - a[1]
      )[0];
      newStats.topBranch = topBranchEntry ? topBranchEntry[0] : '';
    }

    setStats(newStats);

    if (applicationStatsResult.data) {
      const statusCounts: Record<string, number> = {
        Applied: 0,
        Shortlisted: 0,
        Selected: 0,
        Rejected: 0,
      };

      applicationStatsResult.data.forEach((app) => {
        statusCounts[app.application_status] =
          (statusCounts[app.application_status] || 0) + 1;
      });

      setApplicationStats(
        Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        }))
      );
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalStudents}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Companies
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalCompanies}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Building2 className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Job Profiles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalJobProfiles}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Briefcase className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalApplications}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Training Programs
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalTrainingPrograms}
              </p>
            </div>
            <div className="bg-cyan-100 p-3 rounded-full">
              <GraduationCap className="text-cyan-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Placed Students
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.placedStudents}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <TrendingUp className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Placement Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Placement Rate
              </span>
              <span className="text-lg font-bold text-gray-900">
                {stats.totalStudents > 0
                  ? (
                      (stats.placedStudents / stats.totalStudents) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${
                    stats.totalStudents > 0
                      ? (stats.placedStudents / stats.totalStudents) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="text-sm font-medium text-gray-600">
                Average Package
              </span>
              <span className="text-lg font-bold text-gray-900">
                {stats.averagePackage.toFixed(2)} LPA
              </span>
            </div>

            {stats.topBranch && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Top Branch
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {stats.topBranch}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Application Status Breakdown
          </h3>
          <div className="space-y-3">
            {applicationStats.map((stat) => (
              <div key={stat.status} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      stat.status === 'Applied'
                        ? 'bg-blue-500'
                        : stat.status === 'Shortlisted'
                        ? 'bg-yellow-500'
                        : stat.status === 'Selected'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {stat.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">
                    {stat.count}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({stats.totalApplications > 0
                      ? ((stat.count / stats.totalApplications) * 100).toFixed(
                          1
                        )
                      : 0}
                    %)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {applicationStats.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No application data available
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Refresh Data
          </button>
          <button className="bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors">
            Export Report
          </button>
          <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-3 px-4 rounded-lg transition-colors">
            Send Notifications
          </button>
          <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
