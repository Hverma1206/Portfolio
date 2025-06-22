import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const GitHubHeatmap = ({ username = 'your-github-username' }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({ total: 0, followers: 0, pullRequests: 0 });

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}`);
        setContributions(response.data.contributions || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        setError('Failed to load GitHub activity');
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  const organizeContributionsByMonth = useMemo(() => {
    if (!contributions || contributions.length === 0) return { monthsData: [], yearContributions: [] };
    
    const yearContributions = contributions.filter(contrib => {
      const date = new Date(contrib.date);
      return date.getFullYear() === selectedYear;
    });
    
    const contributionMap = {};
    yearContributions.forEach(contrib => {
      contributionMap[contrib.date] = contrib.count;
    });
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const relevantMonths = [];
    
    for (let i = 4; i >= 0; i--) {
      let targetMonth = currentMonth - i;
      let targetYear = currentYear;
      
      if (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }
      
      if (targetYear === selectedYear) {
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(targetYear, targetMonth, 1).getDay();
        
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(targetYear, targetMonth, day);
          const dateString = date.toISOString().split('T')[0];
          days.push({
            date: dateString,
            count: contributionMap[dateString] || 0,
            day: day
          });
        }
        
        relevantMonths.push({
          name: monthNames[targetMonth],
          year: targetYear,
          firstDay: firstDayOfMonth,
          days: days
        });
      }
    }
    
    return { monthsData: relevantMonths, yearContributions };
  }, [contributions, selectedYear]);

  useEffect(() => {
    if (organizeContributionsByMonth && organizeContributionsByMonth.yearContributions) {
      const totalCount = organizeContributionsByMonth.yearContributions.reduce((sum, contrib) => sum + contrib.count, 0);
      setStats({
        total: totalCount,
        followers: Math.floor(totalCount * 0.28), // not dynamic now
        pullRequests: Math.floor(totalCount * 0.07)  // not dynamic now
      });
    }
  }, [organizeContributionsByMonth]);

  const monthlyData = organizeContributionsByMonth.monthsData || [];

  return (
    <div className="w-full py-8">
      <div className="github-heatmap bg-[var(--bg-black-100)] p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            className="text-xl md:text-2xl font-bold text-[var(--text-black-900)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            GitHub Contributions
          </motion.h2>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <select 
              className="bg-[var(--bg-black-50)] text-[var(--text-black-900)] px-4 py-2 rounded-lg appearance-none pr-8"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--skin-color)]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : (
          <div className="space-y-8">
            <div className="overflow-x-auto pb-4">
              <div className="inline-flex flex-col min-w-max">

                {/* month */}
                <div className="flex mb-2">
                  {monthlyData.map((month, i) => (
                    <div key={`header-${month.name}`} className="w-[180px] text-center font-medium text-[var(--text-black-900)]">
                      {month.name}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-6">
                  {monthlyData.map((month, monthIndex) => (
                    <div key={`month-${month.name}`} className="w-[180px]">


                      {/* day */}
                      <div className="grid grid-cols-7 mb-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                          <div key={`day-${i}`} className="text-xs text-center text-[var(--text-black-700)]">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: month.firstDay || 0 }).map((_, i) => (
                          <div key={`empty-${i}`} className="w-5 h-5"></div>
                        ))}
                        
                        {month.days.map((day, dayIndex) => (
                          <motion.div
                            key={`day-${day.date}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              delay: (monthIndex * 0.1) + (dayIndex * 0.005), 
                              duration: 0.2 
                            }}
                            className={`w-5 h-5 rounded-sm ${getColorClass(day.count)}`}
                            title={`${day.date}: ${day.count} contributions`}
                          >
                            <span className="sr-only">{day.count} contributions on {day.date}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <div className="w-full bg-[var(--bg-black-50)] h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[var(--skin-color)]" 
                      style={{ width: `${((new Date().getMonth() + 1) / 12) * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${((new Date().getMonth() + 1) / 12) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="flex flex-wrap justify-around gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 text-[var(--text-black-900)]">
                <Calendar className="w-5 h-5 text-[var(--skin-color)]" />
                <span className="font-semibold">{stats.total}</span>
                <span className="text-sm text-[var(--text-black-700)]">contributions</span>
              </div>
              
              <div className="flex items-center gap-2 text-[var(--text-black-900)]">
                <svg className="w-5 h-5 text-[var(--skin-color)]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zm0-8a2 2 0 100 4 2 2 0 000-4z"/>
                </svg>
                <span className="font-semibold">{stats.followers}</span>
                <span className="text-sm text-[var(--text-black-700)]">followers</span>
              </div>
              
              <div className="flex items-center gap-2 text-[var(--text-black-900)]">
                <svg className="w-5 h-5 text-[var(--skin-color)]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7.177 3.073L9.573.677a.5.5 0 01.707 0l2.12 2.121a.5.5 0 010 .707l-2.396 2.396A1.5 1.5 0 009 6.6v1.9l4.4 4.4a.5.5 0 010 .707l-.707.707a.5.5 0 01-.707 0L7.6 9.9H5.7a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 01.177-.7L2.146 5.47a.5.5 0 010-.707l2.12-2.121a.5.5 0 01.707 0L7.177 4.74a1.5 1.5 0 010-1.667z"/>
                </svg>
                <span className="font-semibold">{stats.pullRequests}</span>
                <span className="text-sm text-[var(--text-black-700)]">Pull Requests</span>
              </div>
            </motion.div>
            
            <div className="flex justify-between mt-4 text-xs text-[var(--text-black-700)]">
              <div className="flex items-center">
                <span className="mr-2">Less</span>
                <div className="flex">
                  <div className="w-3 h-3 rounded-sm bg-gray-200 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-200 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-300 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-400 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                </div>
                <span className="ml-2">More</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-4">
        <a 
          href={`https://github.com/${username}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[var(--skin-color)] hover:underline"
        >
          View GitHub Profile
        </a>
      </div>
    </div>
  );
};

const getColorClass = (count) => {
  if (count === 0) return "bg-gray-200 dark:bg-gray-800";
  if (count < 5) return "bg-green-200 dark:bg-green-900";
  if (count < 10) return "bg-green-300 dark:bg-green-700";
  if (count < 15) return "bg-green-400 dark:bg-green-600";
  return "bg-green-500 dark:bg-green-500";
};

export default GitHubHeatmap;
