import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import { Companies } from './components/Companies';
import { JobProfiles } from './components/JobProfiles';
import { Applications } from './components/Applications';
import { TrainingPrograms } from './components/TrainingPrograms';

type Tab =
  | 'dashboard'
  | 'students'
  | 'companies'
  | 'jobs'
  | 'applications'
  | 'training';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    {
      id: 'dashboard' as Tab,
      name: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'students' as Tab,
      name: 'Students',
      icon: Users,
    },
    {
      id: 'companies' as Tab,
      name: 'Companies',
      icon: Building2,
    },
    {
      id: 'jobs' as Tab,
      name: 'Job Profiles',
      icon: Briefcase,
    },
    {
      id: 'applications' as Tab,
      name: 'Applications',
      icon: FileText,
    },
    {
      id: 'training' as Tab,
      name: 'Training',
      icon: GraduationCap,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'companies':
        return <Companies />;
      case 'jobs':
        return <JobProfiles />;
      case 'applications':
        return <Applications />;
      case 'training':
        return <TrainingPrograms />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Training & Placement Cell
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Management System
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="bg-white rounded-lg shadow mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </nav>

        <main>{renderContent()}</main>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Training and Placement Cell Management System - DBMS Semester
            Project
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;