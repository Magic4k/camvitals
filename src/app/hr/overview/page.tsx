'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/user-context';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Download, 
  Filter,
  Heart,
  Brain,
  Activity,
  Eye,
  Shield,
  FileText,
  BarChart3,
  PieChart,
  Settings,
  Search,
  Bell,
  ChevronDown,
  User,
  Clock,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  LogOut
} from 'lucide-react';

const HRDashboard = () => {
  const router = useRouter();
  const { logout, user } = useUser();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [alertsFilter, setAlertsFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);

  // Sample data for demonstration
  const departments = [
    { id: 'all', name: 'All Departments', employees: 124, avgStress: 3.2, avgFocus: 7.8 },
    { id: 'engineering', name: 'Engineering', employees: 45, avgStress: 3.8, avgFocus: 8.2 },
    { id: 'sales', name: 'Sales', employees: 32, avgStress: 4.1, avgFocus: 7.1 },
    { id: 'marketing', name: 'Marketing', employees: 28, avgStress: 3.5, avgFocus: 7.5 },
    { id: 'hr', name: 'Human Resources', employees: 12, avgStress: 2.9, avgFocus: 8.0 },
    { id: 'finance', name: 'Finance', employees: 15, avgStress: 3.1, avgFocus: 7.9 }
  ];

  const employees = [
    { id: 1, name: 'Anonymous Employee A', dept: 'Engineering', status: 'healthy', heartRate: 72, stress: 3.2, focus: 8.5, lastActive: '2 min ago' },
    { id: 2, name: 'Anonymous Employee B', dept: 'Sales', status: 'warning', heartRate: 89, stress: 4.8, focus: 6.2, lastActive: '5 min ago' },
    { id: 3, name: 'Anonymous Employee C', dept: 'Marketing', status: 'healthy', heartRate: 68, stress: 2.9, focus: 7.8, lastActive: '1 min ago' },
    { id: 4, name: 'Anonymous Employee D', dept: 'Engineering', status: 'alert', heartRate: 95, stress: 6.1, focus: 4.2, lastActive: '3 min ago' },
    { id: 5, name: 'Anonymous Employee E', dept: 'Finance', status: 'healthy', heartRate: 75, stress: 3.0, focus: 8.1, lastActive: '8 min ago' }
  ];

  const alerts = [
    { id: 1, type: 'high_stress', employee: 'Anonymous Employee D', dept: 'Engineering', time: '2 minutes ago', severity: 'high' },
    { id: 2, type: 'low_focus', employee: 'Anonymous Employee B', dept: 'Sales', time: '15 minutes ago', severity: 'medium' },
    { id: 3, type: 'heart_rate', employee: 'Anonymous Employee F', dept: 'Marketing', time: '1 hour ago', severity: 'high' },
    { id: 4, type: 'fatigue', employee: 'Anonymous Employee G', dept: 'Engineering', time: '2 hours ago', severity: 'low' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/10';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10';
      case 'alert': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">HR Dashboard</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    Team Wellness Overview
                  </h1>
                  <p className="text-xs text-gray-400">
                    Real-time employee health monitoring
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-400">
                  124 Active Employees
                </span>
              </div>
              {user && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
              )}
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white relative">
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">4</span>
                </div>
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white">
                <Settings className="w-4 h-4" />
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filters:</span>
          </div>
          
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Team Wellness Summaries */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Department Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {departments.slice(1).map((dept) => (
                <div key={dept.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{dept.name}</h3>
                    <div className="text-sm text-gray-400">{dept.employees} employees</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Avg Stress Level</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{dept.avgStress}/10</span>
                        <div className={`w-3 h-3 rounded-full ${dept.avgStress > 4 ? 'bg-red-500' : dept.avgStress > 3 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Avg Focus Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{dept.avgFocus}/10</span>
                        <div className={`w-3 h-3 rounded-full ${dept.avgFocus > 7 ? 'bg-green-500' : dept.avgFocus > 5 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stress/Focus Heatmap */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Stress & Focus Heatmap</h3>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-400">Time Range:</div>
                  <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white">
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                </div>
              </div>
              
              {/* Heatmap Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-24 gap-1">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="text-xs text-gray-400 text-center">
                      {hour % 6 === 0 ? `${hour}:00` : ''}
                    </div>
                  ))}
                </div>
                
                {['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'].map((dept, deptIndex) => (
                  <div key={dept} className="flex items-center gap-2">
                    <div className="w-20 text-sm text-gray-300 font-medium">{dept}</div>
                    <div className="grid grid-cols-24 gap-1 flex-1">
                      {Array.from({ length: 24 }, (_, hour) => {
                        const intensity = Math.random();
                        const isWorkHour = hour >= 9 && hour <= 17;
                        const stressLevel = isWorkHour ? intensity * 0.8 + 0.2 : intensity * 0.3;
                        return (
                          <div
                            key={hour}
                            className={`h-6 rounded-sm ${
                              stressLevel > 0.7 ? 'bg-red-500/80' :
                              stressLevel > 0.5 ? 'bg-yellow-500/80' :
                              stressLevel > 0.3 ? 'bg-green-500/80' :
                              'bg-gray-700/50'
                            }`}
                            title={`${dept} - ${hour}:00 - Stress: ${(stressLevel * 10).toFixed(1)}/10`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">Stress Level Scale:</div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/80 rounded-sm" />
                  <span className="text-xs text-gray-400">Low</span>
                  <div className="w-4 h-4 bg-yellow-500/80 rounded-sm" />
                  <span className="text-xs text-gray-400">Medium</span>
                  <div className="w-4 h-4 bg-red-500/80 rounded-sm" />
                  <span className="text-xs text-gray-400">High</span>
                </div>
              </div>
            </div>

            {/* Employee Overview Panel */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Employee Overview</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Employee</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Department</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Heart Rate</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Stress</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Focus</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-300" />
                            </div>
                            <span className="text-sm font-medium text-white">{employee.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-300">{employee.dept}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-white font-medium">{employee.heartRate} BPM</td>
                        <td className="py-3 px-4 text-sm text-white font-medium">{employee.stress}/10</td>
                        <td className="py-3 px-4 text-sm text-white font-medium">{employee.focus}/10</td>
                        <td className="py-3 px-4 text-sm text-gray-400">{employee.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Alerts & Quick Stats */}
          <div className="space-y-8">
            
            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Total Employees</span>
                  </div>
                  <span className="text-lg font-semibold text-white">124</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Healthy Status</span>
                  </div>
                  <span className="text-lg font-semibold text-green-400">89%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Warnings</span>
                  </div>
                  <span className="text-lg font-semibold text-yellow-400">8</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-300">Critical Alerts</span>
                  </div>
                  <span className="text-lg font-semibold text-red-400">3</span>
                </div>
              </div>
            </div>

            {/* Emergency Alerts */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Emergency Alerts</h3>
                <select
                  value={alertsFilter}
                  onChange={(e) => setAlertsFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
                >
                  <option value="all">All Alerts</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-white capitalize">
                          {alert.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{alert.employee}</p>
                    <p className="text-xs text-gray-400">{alert.dept} • {alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wellness Trends */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Wellness Trends</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Average Stress</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(-0.3)}
                    <span className="text-sm font-medium text-white">3.4/10</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Average Focus</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(0.2)}
                    <span className="text-sm font-medium text-white">7.6/10</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Heart Rate Avg</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(0.1)}
                    <span className="text-sm font-medium text-white">78 BPM</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Activity Level</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(0.5)}
                    <span className="text-sm font-medium text-white">6.8/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generate Report</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <input
                    type="date"
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white">
                  <option>Wellness Summary</option>
                  <option>Department Analysis</option>
                  <option>Individual Trends</option>
                  <option>Alert History</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Export Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors">
                    <FileText className="w-4 h-4" />
                    PDF
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    CSV
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors">
                    <PieChart className="w-4 h-4" />
                    Excel
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle report generation
                  setShowReportModal(false);
                }}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard; 