import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  Activity,
  Download,
  RefreshCw,
  Shield,
  AlertTriangle,
  Mail,
  Calendar,
  BookOpen,
  UserCheck,
  Star,
  Clock
} from 'lucide-react';

import InternCard from '../../cards/InternCard'
import { scoreRankingInterns, getAllInterns } from '../../../api/index';
import { requestHandler } from '../../../utils';

const Analytics = () => {
  const [interns, setInterns] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState('overview');
  const [showAllInterns, setShowAllInterns] = useState(false);

  // Indigo/Purple color palette
  const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    light: '#a78bfa',
    lighter: '#c7d2fe',
    lightest: '#e0e7ff',
    dark: '#4f46e5',
    darker: '#4338ca',
    darkest: '#312e81',
    accent1: '#f59e0b',
    accent2: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#a855f7',
    pink: '#ec4899'
  };

  const chartColors = [
    colors.primary,
    colors.secondary,
    colors.purple,
    colors.pink,
    colors.dark,
    colors.darker
  ];

  useEffect(() => {
    fetchInterns();
    fetchRankingData();
  }, []);

  // Fetch interns using requestHandler
  const fetchInterns = () => {
    requestHandler(
      async () => await getAllInterns(),
      setLoading,
      (response) => {
        const roundedData = response.data.map(intern => ({
          ...intern,
          score: intern.score ? Math.round(intern.score) : 0
        }));
        setInterns(roundedData);
        setError(null);
      },
      (error) => {
        setError(error.message || 'Failed to fetch interns');
        console.error('Error fetching interns:', error);
      }
    );
  };

  // Fetch ranking data using requestHandler
  const fetchRankingData = () => {
    requestHandler(
      async () => await scoreRankingInterns(),
      setLoading,
      (response) => {
        const roundedData = response.data.map(intern => ({
          ...intern,
          score: intern.score ? Math.round(intern.score) : 0
        }));
        setRankingData(roundedData);
        setError(null);
      },
      (error) => {
        setError(error.message || 'Failed to fetch ranking data');
        console.error('Error fetching ranking:', error);
      }
    );
  };

  // Handle intern actions
  const handleViewIntern = (intern) => {
    console.log('View intern:', intern);
    // Add your view logic here
  };

  const handleEditIntern = (intern) => {
    console.log('Edit intern:', intern);
    // Add your edit logic here
  };

  const handleEmailIntern = (intern) => {
    console.log('Email intern:', intern);
    window.location.href = `mailto:${intern.email}`;
  };

  const handleShareIntern = (intern) => {
    console.log('Share intern:', intern);
    // Add your share logic here
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!interns.length) return {
      totalInterns: 0,
      activeInterns: 0,
      avgScore: 0,
      complianceIssues: 0,
      disciplineIssues: 0,
      completionRate: 0
    };

    const total = interns.length;
    const active = interns.filter(i => i.isActive).length;
    const avgScore = interns.reduce((acc, i) => acc + (i.score || 0), 0) / total;
    const complianceIssues = interns.filter(i => i.isCompliantIssue).length;
    const disciplineIssues = interns.filter(i => i.isDisciplineIssue).length;
    const completed = interns.filter(i => !i.isActive).length;
    const completionRate = (completed / total) * 100;

    return {
      totalInterns: total,
      activeInterns: active,
      avgScore: Math.round(avgScore),
      complianceIssues,
      disciplineIssues,
      completionRate: Math.round(completionRate)
    };
  };

  // Department distribution
  const getDepartmentData = () => {
    const deptMap = new Map();
    interns.forEach(intern => {
      const dept = intern.department || 'Unassigned';
      deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
    });

    return Array.from(deptMap, ([name, value]) => ({ name, value }));
  };

  // Score distribution
  const getScoreDistribution = () => {
    const ranges = [
      { range: '90-100', min: 90, max: 100, count: 0, color: colors.primary },
      { range: '80-89', min: 80, max: 89, count: 0, color: colors.secondary },
      { range: '70-79', min: 70, max: 79, count: 0, color: colors.purple },
      { range: '60-69', min: 60, max: 69, count: 0, color: colors.pink },
      { range: 'Below 60', min: 0, max: 59, count: 0, color: colors.accent2 }
    ];

    interns.forEach(intern => {
      const score = intern.score || 0;
      const range = ranges.find(r => score >= r.min && score <= r.max);
      if (range) range.count++;
    });

    return ranges;
  };

  // Mentor performance
  const getMentorData = () => {
    const mentorMap = new Map();
    interns.forEach(intern => {
      if (intern.mentor) {
        const mentor = intern.mentor;
        if (!mentorMap.has(mentor)) {
          mentorMap.set(mentor, {
            name: mentor,
            total: 0,
            avgScore: 0,
            scoreSum: 0,
            active: 0
          });
        }
        const data = mentorMap.get(mentor);
        data.total++;
        data.scoreSum += intern.score || 0;
        if (intern.isActive) data.active++;
      }
    });

    return Array.from(mentorMap.values()).map(m => ({
      ...m,
      avgScore: Math.round(m.scoreSum / m.total)
    }));
  };

  const stats = calculateStats();
  const departmentData = getDepartmentData();
  const scoreDistribution = getScoreDistribution();
  const mentorData = getMentorData();
  const topPerformers = rankingData.slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, subtitle, color = colors.primary }) => (
    <div
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ borderLeftColor: color }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color: colors.darkest }}>
            {value}
          </p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: colors.lightest }}>
          <Icon size={24} color={colors.primary} />
        </div>
      </div>
    </div>
  );

  if (loading && !interns.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="animate-spin mx-auto mb-4" size={48} color={colors.primary} />
            <div className="absolute inset-0 animate-ping">
              <RefreshCw className="mx-auto mb-4" size={48} color={colors.light} />
            </div>
          </div>
          <p className="text-gray-600" style={{ color: colors.dark }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-xl">
          <AlertCircle size={48} color={colors.accent2} className="mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => {
              fetchInterns();
              fetchRankingData();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.darkest }}>
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive overview of intern performance and metrics
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                fetchInterns();
                fetchRankingData();
              }}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={20} color={colors.primary} />
            </button>
            <button
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-white transition-all duration-300 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darker} 100%)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
              }}
            >
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mt-6 border-b border-gray-200">
          {['overview', 'performance', 'departments', 'mentors'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedView(tab)}
              className={`px-4 py-2 capitalize font-medium transition-colors relative ${
                selectedView === tab
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {selectedView === tab && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatCard
          title="Total Interns"
          value={stats.totalInterns}
          icon={Users}
          color={colors.primary}
        />
        <StatCard
          title="Active Interns"
          value={stats.activeInterns}
          icon={Activity}
          subtitle={`${stats.totalInterns ? Math.round((stats.activeInterns / stats.totalInterns) * 100) : 0}% active`}
          color={colors.secondary}
        />
        <StatCard
          title="Average Score"
          value={stats.avgScore}
          icon={Award}
          color={colors.purple}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={TrendingUp}
          color={colors.pink}
        />
        <StatCard
          title="Compliance Issues"
          value={stats.complianceIssues}
          icon={Shield}
          color={colors.accent1}
        />
        <StatCard
          title="Discipline Issues"
          value={stats.disciplineIssues}
          icon={AlertTriangle}
          color={colors.accent2}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Score Distribution Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.darkest }}>
            Score Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${colors.light}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {scoreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.darkest }}>
            Department Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mentor Performance */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.darkest }}>
            Mentor Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mentorData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Bar dataKey="avgScore" radius={[0, 4, 4, 0]}>
                {mentorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.darkest }}>
            Top Performers
          </h2>
          <div className="space-y-4">
            {topPerformers.length > 0 ? (
              topPerformers.map((intern, index) => (
                <div
                  key={intern._id}
                  className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:shadow-md"
                  style={{
                    background: index === 0 ? 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)' : '#f9fafb',
                    border: index === 0 ? `1px solid ${colors.light}` : 'none'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                      style={{
                        background: index === 0
                          ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                          : `linear-gradient(135deg, ${colors.light}, ${colors.purple})`,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{intern.name}</p>
                      <p className="text-sm text-gray-600">{intern._id?.slice(-6)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: colors.darkest }}>
                      {intern.score}%
                    </p>
                    <p className="text-sm text-gray-600">{intern.department}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No ranking data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Interns Section with InternCard */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" style={{ color: colors.darkest }}>
            {showAllInterns ? 'All Interns' : 'Recent Interns'}
          </h2>
          <button
            onClick={() => setShowAllInterns(!showAllInterns)}
            className="px-3 py-1 text-sm rounded-lg transition-colors"
            style={{
              color: colors.primary,
              border: `1px solid ${colors.light}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.lightest;
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = colors.light;
            }}
          >
            {showAllInterns ? 'Show Less' : 'View All'}
          </button>
        </div>

        {/* Intern Cards Grid using InternCard component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAllInterns ? interns : interns.slice(0, 6)).map((intern) => (
            <InternCard
              key={intern._id}
              intern={intern}
              onView={handleViewIntern}
              onEdit={handleEditIntern}
              onEmail={handleEmailIntern}
              onShare={handleShareIntern}
              variant="default"
            />
          ))}
        </div>

        {!showAllInterns && interns.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAllInterns(true)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
              style={{
                color: colors.primary,
                border: `1px solid ${colors.light}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.lightest;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Load More Interns ({interns.length - 6} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
