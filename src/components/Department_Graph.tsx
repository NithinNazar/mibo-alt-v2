
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     XAxis,
//     YAxis,
//     ResponsiveContainer,
//     Tooltip,
//     Area,
//     AreaChart,
//     PieChart,
//     Pie,
//     Cell,
//     RadialBarChart,
//     RadialBar,
// } from 'recharts';
// import {
//     TrendingUp,
//     TrendingDown,
//     Users,
//     Star,
//     Award,
//     Activity,
//     Heart,
//     Brain,
//     ArrowRight,
//     Shield,
//     Search,
//     MoreVertical,
//     ArrowUp,
//     ArrowDown,
//     ChevronDown,
//     Pill,
//     HandHelping,
//     ChevronLeft,
//     ChevronRight,
// } from 'lucide-react';
// import AnimatedButton from '../ui/Button/Button';

// // Custom Dropdown Component
// const CustomDropdown = ({ value, onChange, options, placeholder = 'Select...', className = '' }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const selectedOption = options.find((option) => option.value === value);

//     return (
//         <div className={`relative ${className}`} ref={dropdownRef}>
//             <button
//                 type="button"
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl 
//                          focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 
//                          text-xs whitespace-nowrap text-center flex items-center justify-between"
//             >
//                 <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
//                     {selectedOption ? selectedOption.label : placeholder}
//                 </span>
//                 <ChevronDown
//                     className={`w-4 h-4 ml-2 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
//                 />
//             </button>

//             {isOpen && (
//                 <div
//                     className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-white/20 
//                                rounded-xl shadow-lg z-50 max-h-60 overflow-auto"
//                 >
//                     {options.map((option) => (
//                         <button
//                             key={option.value}
//                             type="button"
//                             onClick={() => {
//                                 onChange(option.value);
//                                 setIsOpen(false);
//                             }}
//                             className={`w-full px-3 py-2 text-left text-xs whitespace-nowrap hover:bg-white/50 
//                                        transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl 
//                                        ${
//                                            value === option.value
//                                                ? 'bg-white/30 text-gray-900 font-medium'
//                                                : 'text-gray-700'
//                                        }`}
//                         >
//                             {option.label}
//                         </button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// // Counter Animation Hook
// const useCounterAnimation = (end, duration = 2000, start = 0) => {
//     const [count, setCount] = useState(start);

//     useEffect(() => {
//         if (start === end) return;

//         let startTime;
//         const animate = (currentTime) => {
//             if (!startTime) startTime = currentTime;
//             const progress = Math.min((currentTime - startTime) / duration, 1);
//             const easeOutQuart = 1 - Math.pow(1 - progress, 4);
//             const currentCount = start + (end - start) * easeOutQuart;

//             if (typeof end === 'number' && end % 1 !== 0) {
//                 setCount(Math.min(currentCount, end));
//             } else {
//                 setCount(Math.floor(Math.min(currentCount, end)));
//             }

//             if (progress < 1) {
//                 requestAnimationFrame(animate);
//             }
//         };

//         requestAnimationFrame(animate);
//     }, [end, duration, start]);

//     return count;
// };

// // Animated Counter Component
// const AnimatedCounter = ({ end, duration = 2000, decimals = 0, suffix = '' }) => {
//     const count = useCounterAnimation(end, duration);
//     const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);

//     return (
//         <span>
//             {displayValue}
//             {suffix}
//         </span>
//     );
// };

// const DepartmentGraphs = () => {
//     const [selectedView, setSelectedView] = useState('grid');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterCriteria, setFilterCriteria] = useState('all');
//     const [animatedData, setAnimatedData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [hoveredDept, setHoveredDept] = useState(null);
//     const [sortBy, setSortBy] = useState('satisfaction');
//     const [sortOrder, setSortOrder] = useState('desc');
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const scrollContainerRef = useRef(null);

//     // Filter and Sort Options
//     const filterOptions = [
//         { value: 'all', label: 'All Departments' },
//         { value: 'excellent', label: 'Excellent (95%+)' },
//         { value: 'good', label: 'Good (90-95%)' },
//         { value: 'average', label: 'Average (<90%)' },
//     ];

//     const sortOptions = [
//         { value: 'satisfaction-desc', label: 'Satisfaction ↓' },
//         { value: 'satisfaction-asc', label: 'Satisfaction ↑' },
//         { value: 'patients-desc', label: 'Patients ↓' },
//         { value: 'patients-asc', label: 'Patients ↑' },
//         { value: 'nps-desc', label: 'NPS ↓' },
//         { value: 'trend-desc', label: 'Trend ↓' },
//     ];

//     const handleSortChange = (value) => {
//         const [criteria, order] = value.split('-');
//         setSortBy(criteria);
//         setSortOrder(order);
//     };

//     const departmentData = [
//         {
//             id: 1,
//             name: 'Psychology',
//             icon: Heart,
//             satisfaction: 94.2,
//             patients: 1247,
//             avgRating: 4.7,
//             responseRate: 89,
//             nps: 78,
//             waitTime: 12,
//             staffRating: 4.8,
//             facilityRating: 4.6,
//             treatmentRating: 4.9,
//             trend: 5.2,
//             reviews: [
//                 { rating: 5, count: 987, name: '5 Star' },
//                 { rating: 4, count: 201, name: '4 Star' },
//                 { rating: 3, count: 45, name: '3 Star' },
//                 { rating: 2, count: 12, name: '2 Star' },
//                 { rating: 1, count: 2, name: '1 Star' },
//             ],
//             monthlyTrend: [
//                 { month: 'Jan', satisfaction: 89, patients: 1100 },
//                 { month: 'Feb', satisfaction: 91, patients: 1150 },
//                 { month: 'Mar', satisfaction: 93, patients: 1200 },
//                 { month: 'Apr', satisfaction: 94.2, patients: 1247 },
//             ],
//         },
//         {
//             id: 2,
//             name: 'Psychiatry',
//             icon: Brain,
//             satisfaction: 92.8,
//             patients: 856,
//             avgRating: 4.6,
//             responseRate: 85,
//             nps: 72,
//             waitTime: 18,
//             staffRating: 4.7,
//             facilityRating: 4.5,
//             treatmentRating: 4.8,
//             trend: 3.1,
//             reviews: [
//                 { rating: 5, count: 678, name: '5 Star' },
//                 { rating: 4, count: 142, name: '4 Star' },
//                 { rating: 3, count: 28, name: '3 Star' },
//                 { rating: 2, count: 7, name: '2 Star' },
//                 { rating: 1, count: 1, name: '1 Star' },
//             ],
//             monthlyTrend: [
//                 { month: 'Jan', satisfaction: 88, patients: 780 },
//                 { month: 'Feb', satisfaction: 90, patients: 820 },
//                 { month: 'Mar', satisfaction: 91, patients: 840 },
//                 { month: 'Apr', satisfaction: 92.8, patients: 856 },
//             ],
//         },
//         {
//             id: 3,
//             name: 'Rehabilitation',
//             icon: HandHelping,
//             satisfaction: 96.1,
//             patients: 634,
//             avgRating: 4.8,
//             responseRate: 91,
//             nps: 82,
//             waitTime: 8,
//             staffRating: 4.9,
//             facilityRating: 4.7,
//             treatmentRating: 4.9,
//             trend: 7.3,
//             reviews: [
//                 { rating: 5, count: 545, name: '5 Star' },
//                 { rating: 4, count: 78, name: '4 Star' },
//                 { rating: 3, count: 9, name: '3 Star' },
//                 { rating: 2, count: 2, name: '2 Star' },
//                 { rating: 1, count: 0, name: '1 Star' },
//             ],
//             monthlyTrend: [
//                 { month: 'Jan', satisfaction: 92, patients: 580 },
//                 { month: 'Feb', satisfaction: 94, patients: 600 },
//                 { month: 'Mar', satisfaction: 95, patients: 620 },
//                 { month: 'Apr', satisfaction: 96.1, patients: 634 },
//             ],
//         },
//         {
//             id: 4,
//             name: 'De-addiction',
//             icon: Pill,
//             satisfaction: 97.5,
//             patients: 1123,
//             avgRating: 4.9,
//             responseRate: 94,
//             nps: 85,
//             waitTime: 15,
//             staffRating: 4.9,
//             facilityRating: 4.8,
//             treatmentRating: 4.9,
//             trend: 4.7,
//             reviews: [
//                 { rating: 5, count: 978, name: '5 Star' },
//                 { rating: 4, count: 128, name: '4 Star' },
//                 { rating: 3, count: 15, name: '3 Star' },
//                 { rating: 2, count: 2, name: '2 Star' },
//                 { rating: 1, count: 0, name: '1 Star' },
//             ],
//             monthlyTrend: [
//                 { month: 'Jan', satisfaction: 94, patients: 1000 },
//                 { month: 'Feb', satisfaction: 96, patients: 1050 },
//                 { month: 'Mar', satisfaction: 97, patients: 1100 },
//                 { month: 'Apr', satisfaction: 97.5, patients: 1123 },
//             ],
//         },
//         {
//             id: 5,
//             name: 'Couples therapy',
//             icon: Shield,
//             satisfaction: 87.3,
//             patients: 2156,
//             avgRating: 4.4,
//             responseRate: 76,
//             nps: 58,
//             waitTime: 25,
//             staffRating: 4.5,
//             facilityRating: 4.2,
//             treatmentRating: 4.6,
//             trend: -2.1,
//             reviews: [
//                 { rating: 5, count: 1234, name: '5 Star' },
//                 { rating: 4, count: 567, name: '4 Star' },
//                 { rating: 3, count: 234, name: '3 Star' },
//                 { rating: 2, count: 89, name: '2 Star' },
//                 { rating: 1, count: 32, name: '1 Star' },
//             ],
//             monthlyTrend: [
//                 { month: 'Jan', satisfaction: 90, patients: 2000 },
//                 { month: 'Feb', satisfaction: 89, patients: 2080 },
//                 { month: 'Mar', satisfaction: 88, patients: 2120 },
//                 { month: 'Apr', satisfaction: 87.3, patients: 2156 },
//             ],
//         },
//     ];

//     const filteredData = animatedData
//         .filter(
//             (dept) =>
//                 dept.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//                 (filterCriteria === 'all' ||
//                     (filterCriteria === 'excellent' && dept.satisfaction >= 95) ||
//                     (filterCriteria === 'good' && dept.satisfaction >= 90 && dept.satisfaction < 95) ||
//                     (filterCriteria === 'average' && dept.satisfaction < 90))
//         )
//         .sort((a, b) => {
//             const aVal = a[sortBy];
//             const bVal = b[sortBy];
//             return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
//         });

//     useEffect(() => {
//         setIsLoading(true);
//         const timer = setTimeout(() => {
//             setAnimatedData(departmentData);
//             setIsLoading(false);
//         }, 800);

//         return () => clearTimeout(timer);
//     }, []);

//     const scrollToCard = (direction) => {
//         if (!scrollContainerRef.current) return;

//         const container = scrollContainerRef.current;
//         const cardWidth = 400; // Approximate card width + gap

//         if (direction === 'next') {
//             setCurrentIndex((prev) => (prev + 1) % filteredData.length);
//         } else {
//             setCurrentIndex((prev) => (prev - 1 + filteredData.length) % filteredData.length);
//         }

//         const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
//         container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     };

//     // Custom Tooltip Components
//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-white/20">
//                     <p className="font-semibold text-gray-800">{`${label}: ${payload[0].value}`}</p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     const CustomPieTooltip = ({ active, payload }) => {
//         if (active && payload && payload.length) {
//             const data = payload[0].payload;
//             return (
//                 <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-white/20">
//                     <p className="font-semibold text-gray-800">{`${data.name}: ${data.count} reviews`}</p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     const DepartmentCard = ({ dept, index }) => {
//         const IconComponent = dept.icon;
//         const delay = index * 100;
//         const pieColors = ['#2FA19A', '#18276c', '#20B2AA', '#4682B4', '#5F9EA0'];

//         return (
//             <div
//                 className="group relative bg-gradient-to-br from-[#18276c]/10 via-[#2FA19A]/10 to-[#18276c]/10
//                           rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-[#2FA19A]/20
//                           backdrop-blur-lg overflow-hidden flex-shrink-0
//                           p-4 sm:p-6 md:p-8 transform transition-all duration-700 
//                           hover:scale-105 hover:shadow-2xl hover:-translate-y-2
//                           hover:bg-gradient-to-br hover:from-[#18276c]/20 hover:via-[#2FA19A]/20 hover:to-[#18276c]/20
//                           w-80 sm:w-96"
//                 style={{
//                     animationDelay: `${delay}ms`,
//                     animation: 'slideInUp 0.8s ease-out forwards',
//                 }}
//                 onMouseEnter={() => setHoveredDept(dept.id)}
//                 onMouseLeave={() => setHoveredDept(null)}
//             >
//                 {/* Header Section */}
//                 <div className="flex items-center justify-between mb-4 sm:mb-6">
//                     <div className="flex items-center space-x-3 sm:space-x-4">
//                         <div
//                             className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl sm:rounded-2xl 
//                                       bg-gradient-to-r from-[#18276c] via-[#2FA19A] to-[#18276c]
//                                       flex items-center justify-center shadow-lg sm:shadow-2xl 
//                                       transform group-hover:rotate-12 group-hover:scale-110 
//                                       transition-all duration-500 border-2 border-white/20"
//                         >
//                             <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
//                         </div>
//                         <div>
//                             <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl lg:text-2xl">
//                                 {dept.name}
//                             </h3>
//                             <p className="text-xs sm:text-sm text-[#18276c]/70 font-medium">
//                                 <AnimatedCounter end={dept.patients} /> patients
//                             </p>
//                         </div>
//                     </div>
//                     <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-[#18276c]/50 group-hover:text-[#2FA19A]" />
//                 </div>

//                 {/* Satisfaction Display */}
//                 <div className="mb-4 sm:mb-6">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-1">
//                             <span className="text-sm sm:text-sm font-semibold text-[#18276c]/80 uppercase">
//                                 Satisfaction Rate
//                             </span>
//                             <ArrowRight className="w-4 h-4 text-[#18276c]/80" />
//                         </div>

//                         <div className="flex items-center space-x-2">
//                             <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-[#18276c] to-[#2FA19A] bg-clip-text text-transparent">
//                                 <AnimatedCounter end={dept.satisfaction} decimals={1} suffix="%" />
//                             </span>
//                             <div
//                                 className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
//                                     dept.trend > 0 ? 'text-[#2FA19A] bg-[#2FA19A]/20' : 'text-red-600 bg-red-100/80'
//                                 }`}
//                             >
//                                 {dept.trend > 0 ? (
//                                     <ArrowUp className="w-3 h-3 mr-1" />
//                                 ) : (
//                                     <ArrowDown className="w-3 h-3 mr-1" />
//                                 )}
//                                 <AnimatedCounter end={Math.abs(dept.trend)} decimals={1} suffix="%" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Rating Grid */}
//                 <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
//                     <div
//                         className="text-center p-3 sm:p-4 bg-gradient-to-br from-white/60 to-white/40 
//                                   backdrop-blur-md rounded-xl border border-white/30"
//                     >
//                         <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
//                             <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA19A] fill-current" />
//                             <span className="text-lg sm:text-xl font-black text-[#18276c]">
//                                 <AnimatedCounter end={dept.avgRating} decimals={1} />
//                             </span>
//                         </div>
//                         <p className="text-xs text-[#18276c]/70 font-semibold uppercase">Rating</p>
//                     </div>
//                     <div
//                         className="text-center p-3 sm:p-4 bg-gradient-to-br from-white/60 to-white/40 
//                                   backdrop-blur-md rounded-xl border border-white/30"
//                     >
//                         <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
//                             <Users className="w-5 h-5 text-[#2FA19A] " />
//                             <span className="text-lg sm:text-xl font-black text-[#18276c]">
//                                 <AnimatedCounter end={dept.nps} />
//                             </span>
//                         </div>
//                         <p className="text-xs text-[#18276c]/70 font-semibold uppercase">Nps</p>
//                     </div>
//                 </div>

//                 {/* Pie Chart */}
//                 <div className="h-16 sm:h-20 md:h-24 mb-4 sm:mb-6 flex justify-center">
//                     <ResponsiveContainer width={80} height={64}>
//                         <PieChart>
//                             <Pie
//                                 data={dept.reviews}
//                                 cx="50%"
//                                 cy="50%"
//                                 innerRadius={20}
//                                 outerRadius={30}
//                                 paddingAngle={3}
//                                 dataKey="count"
//                                 animationDuration={2000}
//                                 animationDelay={delay}
//                             >
//                                 {dept.reviews.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip content={<CustomPieTooltip />} />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
//                     <div
//                         className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#2FA19A]/20 to-[#2FA19A]/10 
//                                   backdrop-blur-md rounded-lg sm:rounded-xl border border-[#2FA19A]/20"
//                     >
//                         <div className="font-black text-[#18276c] text-sm sm:text-base">
//                             <AnimatedCounter end={dept.responseRate} suffix="%" />
//                         </div>
//                         <div className="text-[#18276c]/70 font-semibold uppercase text-xs">Response</div>
//                     </div>
//                     <div
//                         className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#18276c]/20 to-[#18276c]/10 
//                                   backdrop-blur-md rounded-lg sm:rounded-xl border border-[#18276c]/20"
//                     >
//                         <div className="font-black text-[#18276c] text-sm sm:text-base">
//                             <AnimatedCounter end={dept.waitTime} suffix="m" />
//                         </div>
//                         <div className="text-[#18276c]/70 font-semibold uppercase text-xs">Wait</div>
//                     </div>
//                     <div
//                         className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#2FA19A]/20 to-[#2FA19A]/10 
//                                   backdrop-blur-md rounded-lg sm:rounded-xl border border-[#2FA19A]/20"
//                     >
//                         <div className="font-black text-[#18276c] text-sm sm:text-base">
//                             <AnimatedCounter end={dept.staffRating} decimals={1} />
//                         </div>
//                         <div className="text-[#18276c]/70 font-semibold uppercase text-xs">Staff</div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const DetailedCard = ({ dept, index }) => {
//         const IconComponent = dept.icon;
//         const delay = index * 50;
//         const pieColors = ['#2FA19A', '#18276c', '#20B2AA', '#4682B4', '#5F9EA0'];

//         return (
//             <div
//                 className="group bg-gradient-to-br from-white/80 via-[#2FA19A]/5 to-[#18276c]/10 
//                           rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-[#2FA19A]/20 
//                           backdrop-blur-lg overflow-hidden transform transition-all duration-700 
//                           hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2"
//                 style={{ animationDelay: `${delay}ms`, animation: 'slideInLeft 0.6s ease-out forwards' }}
//             >
//                 <div className="p-4 sm:p-6 md:p-8">
//                     {/* Header */}
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
//                         <div className="flex items-center space-x-4 sm:space-x-6">
//                             <div
//                                 className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl 
//                                           bg-gradient-to-r from-[#18276c] via-[#2FA19A] to-[#18276c] 
//                                           flex items-center justify-center shadow-xl transform group-hover:scale-110 
//                                           group-hover:rotate-12 transition-all duration-500 border-2 border-white/30"
//                             >
//                                 <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
//                             </div>
//                             <div>
//                                 <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#18276c]">{dept.name}</h3>
//                                 <p className="text-sm sm:text-base md:text-lg text-[#18276c]/70 font-semibold">
//                                     <AnimatedCounter end={dept.patients} /> patients served
//                                 </p>
//                             </div>
//                         </div>
//                         <div
//                             className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl 
//                                        text-xs sm:text-sm font-bold ${
//                                            dept.trend > 0
//                                                ? 'text-[#2FA19A] bg-[#2FA19A]/20 border border-[#2FA19A]/30'
//                                                : 'text-red-600 bg-red-100/80 border border-red-200'
//                                        }`}
//                         >
//                             {dept.trend > 0 ? (
//                                 <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
//                             ) : (
//                                 <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
//                             )}
//                             <AnimatedCounter end={Math.abs(dept.trend)} decimals={1} suffix="%" />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
//                         {/* Left: Satisfaction Radial Chart */}
//                         <div className="lg:col-span-1">
//                             <div className="text-center">
//                                 <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 sm:mb-6">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <RadialBarChart
//                                             cx="50%"
//                                             cy="50%"
//                                             innerRadius="70%"
//                                             outerRadius="90%"
//                                             barSize={10}
//                                             data={[
//                                                 { name: 'Satisfaction', value: dept.satisfaction, fill: '#2FA19A' },
//                                                 { name: 'Remaining', value: 100 - dept.satisfaction, fill: '#E5E7EB' },
//                                             ]}
//                                             startAngle={90}
//                                             endAngle={-270}
//                                         >
//                                             <RadialBar background clockWise dataKey="value" cornerRadius={50} />
//                                         </RadialBarChart>
//                                     </ResponsiveContainer>

//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                         <div className="text-center">
//                                             <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#18276c] to-[#2FA19A] bg-clip-text text-transparent">
//                                                 <AnimatedCounter end={dept.satisfaction} decimals={1} suffix="%" />
//                                             </div>
//                                             <div className="text-xs sm:text-sm text-[#18276c]/70 font-semibold uppercase">
//                                                 Satisfaction
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Middle: Stats Cards */}
//                         <div className="lg:col-span-1 space-y-4 sm:space-y-6">
//                             <div className="grid grid-cols-2 gap-3 sm:gap-4">
//                                 <div
//                                     className="bg-gradient-to-br from-[#2FA19A]/20 via-white/60 to-[#2FA19A]/10 
//              backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#2FA19A]/20"
//                                 >
//                                     <div className="flex items-center space-x-2 mb-2">
//                                         <span className="text-xs sm:text-sm font-bold text-[#18276c]/80 uppercase">
//                                             Rating
//                                         </span>
//                                     </div>

//                                     {/* Number + Star */}
//                                     <div className="flex items-center space-x-2 text-xl sm:text-2xl font-black text-[#18276c]">
//                                         <AnimatedCounter end={dept.avgRating} decimals={1} />
//                                         <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
//                                     </div>
//                                 </div>

//                                 <div
//                                     className="bg-gradient-to-br from-[#18276c]/20 via-white/60 to-[#18276c]/10 
//                                               backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#18276c]/20"
//                                 >
//                                     <div className="flex items-center space-x-2 mb-2">
//                                         <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
//                                         <span className="text-xs sm:text-sm font-bold text-[#18276c]/80 uppercase">
//                                             NPS
//                                         </span>
//                                     </div>
//                                     <div className="text-xl sm:text-2xl font-black text-[#18276c]">
//                                         <AnimatedCounter end={dept.nps} />
//                                     </div>
//                                 </div>

//                                 <div
//                                     className="bg-gradient-to-br from-[#2FA19A]/20 via-white/60 to-[#2FA19A]/10 
//                                               backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#2FA19A]/20"
//                                 >
//                                     <div className="flex items-center space-x-2 mb-2">
//                                         <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#18276c]" />
//                                         <span className="text-xs sm:text-sm font-bold text-[#18276c]/80 uppercase">
//                                             Response
//                                         </span>
//                                     </div>
//                                     <div className="text-xl sm:text-2xl font-black text-[#18276c]">
//                                         <AnimatedCounter end={dept.responseRate} suffix="%" />
//                                     </div>
//                                 </div>

//                                 <div
//                                     className="bg-gradient-to-br from-[#18276c]/20 via-white/60 to-[#18276c]/10 
//                                               backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#18276c]/20"
//                                 >
//                                     <div className="flex items-center space-x-2 mb-2">
//                                         <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA19A]" />
//                                         <span className="text-xs sm:text-sm font-bold text-[#18276c]/80 uppercase">
//                                             Wait
//                                         </span>
//                                     </div>
//                                     <div className="text-xl sm:text-2xl font-black text-[#18276c]">
//                                         <AnimatedCounter end={dept.waitTime} suffix="m" />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Trend Chart */}
//                             <div
//                                 className="bg-gradient-to-br from-white/70 via-[#2FA19A]/5 to-white/50 
//                                           backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30"
//                             >
//                                 <h4 className="text-base sm:text-lg font-black text-[#18276c] mb-3 sm:mb-4 uppercase">
//                                     Monthly Trend
//                                 </h4>
//                                 <div className="h-24 sm:h-32">
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <AreaChart data={dept.monthlyTrend}>
//                                             <defs>
//                                                 <linearGradient id={`colorGradient${dept.id}`} x1="0" y1="0" x2="0" y2="1">
//                                                     <stop offset="5%" stopColor="#2FA19A" stopOpacity={0.4} />
//                                                     <stop offset="95%" stopColor="#18276c" stopOpacity={0.1} />
//                                                 </linearGradient>
//                                             </defs>
//                                             <XAxis
//                                                 dataKey="month"
//                                                 tick={{ fontSize: 10, fill: '#18276c' }}
//                                                 axisLine={false}
//                                                 tickLine={false}
//                                             />
//                                             <YAxis hide />
//                                             <Tooltip content={<CustomTooltip />} />
//                                             <Area
//                                                 type="monotone"
//                                                 dataKey="satisfaction"
//                                                 stroke="#2FA19A"
//                                                 strokeWidth={2}
//                                                 fill={`url(#colorGradient${dept.id})`}
//                                                 animationDuration={2500}
//                                                 animationDelay={delay + 500}
//                                             />
//                                         </AreaChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Right: Review Distribution */}
//                         <div className="lg:col-span-1">
//                             <div className="space-y-4 sm:space-y-6">
//                                 {/* Donut Chart */}
//                                 <div
//                                     className="bg-gradient-to-br from-white/70 via-[#18276c]/5 to-white/50 
//                                                 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30"
//                                 >
//                                     <h4 className="text-base sm:text-lg font-black text-[#18276c] mb-3 sm:mb-4 uppercase">
//                                         Reviews
//                                     </h4>
//                                     <div className="h-32 sm:h-40 relative">
//                                         <ResponsiveContainer width="100%" height="100%">
//                                             <PieChart>
//                                                 <Pie
//                                                     data={dept.reviews}
//                                                     cx="50%"
//                                                     cy="50%"
//                                                     innerRadius={30}
//                                                     outerRadius={55}
//                                                     paddingAngle={4}
//                                                     dataKey="count"
//                                                     animationDuration={2500}
//                                                     animationDelay={delay + 200}
//                                                 >
//                                                     {dept.reviews.map((entry, index) => (
//                                                         <Cell
//                                                             key={`cell-${index}`}
//                                                             fill={pieColors[index % pieColors.length]}
//                                                         />
//                                                     ))}
//                                                 </Pie>
//                                                 <Tooltip content={<CustomPieTooltip />} />
//                                             </PieChart>
//                                         </ResponsiveContainer>
//                                     </div>
//                                 </div>

//                                 {/* Rating Breakdown */}
//                                 <div className="space-y-2 sm:space-y-3">
//                                     <h4 className="text-base sm:text-lg font-black text-[#18276c] uppercase">Breakdown</h4>
//                                     {dept.reviews.map((review, idx) => (
//                                         <div key={idx} className="flex items-center space-x-3 sm:space-x-4">
//                                             <div className="flex items-center space-x-1 sm:space-x-2 w-12 sm:w-16">
//                                                 <span className="text-xs sm:text-sm font-bold text-[#18276c]">
//                                                     {review.rating}
//                                                 </span>
//                                                 <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
//                                             </div>
//                                             <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
//                                                 <div
//                                                     className="h-full rounded-full transition-all duration-1500"
//                                                     style={{
//                                                         background: `linear-gradient(90deg, ${
//                                                             pieColors[idx % pieColors.length]
//                                                         }, ${pieColors[idx % pieColors.length]}aa)`,
//                                                         width: `${
//                                                             (review.count / Math.max(...dept.reviews.map((r) => r.count))) *
//                                                             100
//                                                         }%`,
//                                                         animationDelay: `${delay + idx * 150}ms`,
//                                                     }}
//                                                 />
//                                             </div>
//                                             <span className="text-xs sm:text-sm font-bold text-[#18276c] w-8 sm:w-12">
//                                                 <AnimatedCounter end={review.count} duration={1800} />
//                                             </span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Bottom Stats */}
//                     <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-4 sm:gap-6">
//                         <div
//                             className="text-center p-3 sm:p-4 bg-gradient-to-br from-[#2FA19A]/20 via-white/60 to-[#2FA19A]/10 
//                                         backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#2FA19A]/20"
//                         >
//                             <div className="text-lg sm:text-xl md:text-2xl font-black text-[#18276c]">
//                                 <AnimatedCounter end={dept.staffRating} decimals={1} />
//                             </div>
//                             <div className="text-xs sm:text-sm text-[#18276c]/70 font-bold uppercase">Staff</div>
//                         </div>
//                         <div
//                             className="text-center p-3 sm:p-4 bg-gradient-to-br from-[#18276c]/20 via-white/60 to-[#18276c]/10 
//                                         backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#18276c]/20"
//                         >
//                             <div className="text-lg sm:text-xl md:text-2xl font-black text-[#18276c]">
//                                 <AnimatedCounter end={dept.facilityRating} decimals={1} />
//                             </div>
//                             <div className="text-xs sm:text-sm text-[#18276c]/70 font-bold uppercase">Facility</div>
//                         </div>
//                         <div
//                             className="text-center p-3 sm:p-4 bg-gradient-to-br from-[#2FA19A]/20 via-white/60 to-[#2FA19A]/10 
//                                         backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#2FA19A]/20"
//                         >
//                             <div className="text-lg sm:text-xl md:text-2xl font-black text-[#18276c]">
//                                 <AnimatedCounter end={dept.treatmentRating} decimals={1} />
//                             </div>
//                             <div className="text-xs sm:text-sm text-[#18276c]/70 font-bold uppercase">Treatment</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-[#18276c]/10 via-[#2FA19A]/5 to-white flex items-center justify-center p-4">
//                 <div className="text-center">
//                     <div className="relative">
//                         <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-[#2FA19A]/30 border-t-[#18276c] rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
//                         <div className="absolute inset-0 flex items-center justify-center">
//                             <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-3 border-[#18276c]/30 border-t-[#2FA19A] rounded-full animate-spin"></div>
//                         </div>
//                     </div>
//                     <p className="text-[#18276c] font-black text-base sm:text-lg md:text-xl animate-pulse bg-gradient-to-r from-[#18276c] to-[#2FA19A] bg-clip-text text-transparent">
//                         Loading Dashboard...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-[#c9f4ec] pb-10 ">
//             {/* Header */}
//             <div className="text-center py-6 sm:py-8 md:py-12 px-4">
//                 <h1
//                     className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight6"
//                     style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
//                 >
//                     Department Analytics
//                 </h1>
//                 {/* <div className="relative mt-4 h-1 w-20 mx-auto mb-0 overflow-hidden rounded-full shadow-lg">
//                     <div
//                         className="absolute inset-0 bg-gradient-to-r from-[#18276c] via-[#2FA19A] to-[#18276c]"
//                         style={{
//                             animation: 'premium-underline 3s ease-in-out infinite',
//                         }}
//                     ></div>
//                 </div> */}
//             </div>
//             {/* Content */}
//             <div className="px-4 sm:px-6 md:px-8">
//                 <div className="max-w-7xl mx-auto">
//                     {selectedView === 'grid' ? (
//                         // Horizontal Scrolling Cards
//                         <div className="relative">
//                             {/* Cards Container */}
//                             <div
//                                 ref={scrollContainerRef}
//                                 className="flex items-center space-x-6 overflow-x-auto  rounded-2xl sm:rounded-3xl scrollbar-hide px-16 py-4  bg-gradient-to-t from-[#aef0e6] via-white to-[#aef0e6]
//                                             snap-x snap-mandatory"
//                                 style={{ scrollBehavior: 'smooth' }}
//                             >
//                                 {filteredData.map((dept, index) => (
//                                     <div key={dept.id} className="snap-center flex-shrink-0">
//                                         <DepartmentCard dept={dept} index={index} />
//                                     </div>
//                                 ))}
//                             </div>
//                             {/* Indicators with Buttons */}
//                             <div className="flex items-center justify-between mt-8 space-x-4">
//                                 {/* Left Button */}
//                                 <button
//                                     onClick={() => scrollToCard('prev')}
//                                     className="w-6 h-6 bg-gradient-to-r from-[#18276c] to-[#2FA19A] 
//                                     rounded-full flex items-center justify-center shadow-md 
//                                     hover:shadow-lg hover:scale-110 transition-all duration-300 text-gray-400"
//                                 >
//                                     <ChevronLeft className="w-5 h-4" />
//                                 </button>

//                                 {/* Indicators */}
//                                 <div className="flex space-x-2">
//                                     {filteredData.map((_, index) => (
//                                         <div
//                                             key={index}
//                                             className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                                                 index === currentIndex ? 'bg-[#2FA19A] scale-125' : 'bg-[#18276c]/30'
//                                             }`}
//                                         />
//                                     ))}
//                                 </div>

//                                 {/* Right Button */}
//                                 <button
//                                     onClick={() => scrollToCard('next')}
//                                     className="w-6 h-6 bg-gradient-to-r from-[#18276c] to-[#2FA19A] 
//                                     rounded-full flex items-center justify-center shadow-md 
//                                     hover:shadow-lg hover:scale-110 transition-all duration-300 text-gray-400"
//                                 >
//                                     <ChevronRight className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="space-y-6 sm:space-y-8">
//                             {filteredData.map((dept, index) => (
//                                 <DetailedCard key={dept.id} dept={dept} index={index} />
//                             ))}
//                         </div>
//                     )}

//                     {filteredData.length === 0 && (
//                         <div className="text-center py-12 sm:py-16">
//                             <div
//                                 className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#2FA19A]/20 to-[#18276c]/20 
//                                             rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
//                             >
//                                 <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 text-[#18276c]/60" />
//                             </div>
//                             <h3 className="text-xl sm:text-2xl font-black text-[#18276c] mb-2 sm:mb-3">
//                                 No departments found
//                             </h3>
//                             <p className="text-sm sm:text-base md:text-lg text-[#18276c]/70">
//                                 Try adjusting your search or filter criteria
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Floating Action Button */}
//             {/* <div className="fixed  bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
//                 <AnimatedButton />
//             </div> */}
//             {/* <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
//                 <button
//                     className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 bg-[#2FA19A]  
//                     transform hover:scale-110 transition-all duration-500 animate-bounce 
//                      text-sm sm:text-sm md:text-base lg:text-lg  tracking-wide 
//                     text-[#fff] rounded-full shadow-xl hover:shadow-2xl 
//                     border border-white/20 hover:border-white/40"
//                 >
//                     Book Appointment
//                 </button>
//             </div>

//             <style jsx>{`
//                 @keyframes slideInUp {
//                     from {
//                         opacity: 0;
//                         transform: translateY(30px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }

//                 @keyframes slideInLeft {
//                     from {
//                         opacity: 0;
//                         transform: translateX(-30px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateX(0);
//                     }
//                 }

//                 .scrollbar-hide {
//                     -ms-overflow-style: none;
//                     scrollbar-width: none;
//                 }

//                 .scrollbar-hide::-webkit-scrollbar {
//                     display: none;
//                 }
//             `}</style> */}
//             <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
//                 <button
//                     className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 bg-[#2FA19A]  
//     transform hover:scale-105 transition-transform duration-300 ease-in-out
//     text-sm sm:text-sm md:text-base lg:text-lg tracking-wide 
//     text-white rounded-full shadow-xl hover:shadow-2xl 
//     border border-white/20 hover:border-white/40"
//                 >
//                     Book Appointment
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DepartmentGraphs;



import React, { useState, useEffect, useRef } from 'react';
import {
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Area,
    AreaChart,
    PieChart,
    Pie,
    Cell,
    RadialBarChart,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Star,
    Award,
    Activity,
    Heart,
    Brain,
    ArrowRight,
    Shield,
    Search,
    MoreVertical,
    ArrowUp,
    ArrowDown,
    // ChevronDown,
    Pill,
    HandHelping,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; 

// Type Definitions
// interface DropdownOption {
//     value: string;
//     label: string;
// }

interface Review {
    rating: number;
    count: number;
    name: string;
}

interface MonthlyTrendData {
    month: string;
    satisfaction: number;
    patients: number;
}

interface Department {
    id: number;
    name: string;
    icon: LucideIcon;
    satisfaction: number;
    patients: number;
    avgRating: number;
    responseRate: number;
    nps: number;
    waitTime: number;
    staffRating: number;
    facilityRating: number;
    treatmentRating: number;
    trend: number;
    reviews: Review[];
    monthlyTrend: MonthlyTrendData[];
}

interface TooltipPayload {
    value: number;
    payload?: any;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

interface CustomPieTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: Review;
    }>;
}

// Custom Dropdown Component
// interface CustomDropdownProps {
//     value: string;
//     onChange: (value: string) => void;
//     options: DropdownOption[];
//     placeholder?: string;
//     className?: string;
// }

// const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
//     value, 
//     onChange, 
//     options, 
//     placeholder = 'Select...', 
//     className = '' 
// }) => {
//     const [isOpen, setIsOpen] = useState<boolean>(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const selectedOption = options.find((option) => option.value === value);

//     return (
//         <div className={`relative ${className}`} ref={dropdownRef}>
//             <button
//                 type="button"
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl 
//                          focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 
//                          text-xs whitespace-nowrap text-center flex items-center justify-between"
//             >
//                 <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
//                     {selectedOption ? selectedOption.label : placeholder}
//                 </span>
//                 <ChevronDown
//                     className={`w-4 h-4 ml-2 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
//                 />
//             </button>

//             {isOpen && (
//                 <div
//                     className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-white/20 
//                                rounded-xl shadow-lg z-50 max-h-60 overflow-auto"
//                 >
//                     {options.map((option) => (
//                         <button
//                             key={option.value}
//                             type="button"
//                             onClick={() => {
//                                 onChange(option.value);
//                                 setIsOpen(false);
//                             }}
//                             className={`w-full px-3 py-2 text-left text-xs whitespace-nowrap hover:bg-white/50 
//                                        transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl 
//                                        ${
//                                            value === option.value
//                                                ? 'bg-white/30 text-gray-900 font-medium'
//                                                : 'text-gray-700'
//                                        }`}
//                         >
//                             {option.label}
//                         </button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// Counter Animation Hook
const useCounterAnimation = (end: number, duration: number = 2000, start: number = 0): number => {
    const [count, setCount] = useState<number>(start);

    useEffect(() => {
        if (start === end) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = start + (end - start) * easeOutQuart;

            if (typeof end === 'number' && end % 1 !== 0) {
                setCount(Math.min(currentCount, end));
            } else {
                setCount(Math.floor(Math.min(currentCount, end)));
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, start]);

    return count;
};

// Animated Counter Component
interface AnimatedCounterProps {
    end: number;
    duration?: number;
    decimals?: number;
    suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
    end, 
    duration = 2000, 
    decimals = 0, 
    suffix = '' 
}) => {
    const count = useCounterAnimation(end, duration);
    const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);

    return (
        <span>
            {displayValue}
            {suffix}
        </span>
    );
};

const DepartmentGraphs: React.FC = () => {
    const [selectedView] = useState<string>('grid');
    const [searchTerm] = useState<string>('');
    const [filterCriteria] = useState<string>('all');
    const [animatedData, setAnimatedData] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [ setHoveredDept] = useState<number | null>(null);
    const [sortBy] = useState<string>('satisfaction');
    const [sortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const departmentData: Department[] = [
        {
            id: 1,
            name: 'Psychology',
            icon: Heart,
            satisfaction: 94.2,
            patients: 1247,
            avgRating: 4.7,
            responseRate: 89,
            nps: 78,
            waitTime: 12,
            staffRating: 4.8,
            facilityRating: 4.6,
            treatmentRating: 4.9,
            trend: 5.2,
            reviews: [
                { rating: 5, count: 987, name: '5 Star' },
                { rating: 4, count: 201, name: '4 Star' },
                { rating: 3, count: 45, name: '3 Star' },
                { rating: 2, count: 12, name: '2 Star' },
                { rating: 1, count: 2, name: '1 Star' },
            ],
            monthlyTrend: [
                { month: 'Jan', satisfaction: 89, patients: 1100 },
                { month: 'Feb', satisfaction: 91, patients: 1150 },
                { month: 'Mar', satisfaction: 93, patients: 1200 },
                { month: 'Apr', satisfaction: 94.2, patients: 1247 },
            ],
        },
        {
            id: 2,
            name: 'Psychiatry',
            icon: Brain,
            satisfaction: 92.8,
            patients: 856,
            avgRating: 4.6,
            responseRate: 85,
            nps: 72,
            waitTime: 18,
            staffRating: 4.7,
            facilityRating: 4.5,
            treatmentRating: 4.8,
            trend: 3.1,
            reviews: [
                { rating: 5, count: 678, name: '5 Star' },
                { rating: 4, count: 142, name: '4 Star' },
                { rating: 3, count: 28, name: '3 Star' },
                { rating: 2, count: 7, name: '2 Star' },
                { rating: 1, count: 1, name: '1 Star' },
            ],
            monthlyTrend: [
                { month: 'Jan', satisfaction: 88, patients: 780 },
                { month: 'Feb', satisfaction: 90, patients: 820 },
                { month: 'Mar', satisfaction: 91, patients: 840 },
                { month: 'Apr', satisfaction: 92.8, patients: 856 },
            ],
        },
        {
            id: 3,
            name: 'Rehabilitation',
            icon: HandHelping,
            satisfaction: 96.1,
            patients: 634,
            avgRating: 4.8,
            responseRate: 91,
            nps: 82,
            waitTime: 8,
            staffRating: 4.9,
            facilityRating: 4.7,
            treatmentRating: 4.9,
            trend: 7.3,
            reviews: [
                { rating: 5, count: 545, name: '5 Star' },
                { rating: 4, count: 78, name: '4 Star' },
                { rating: 3, count: 9, name: '3 Star' },
                { rating: 2, count: 2, name: '2 Star' },
                { rating: 1, count: 0, name: '1 Star' },
            ],
            monthlyTrend: [
                { month: 'Jan', satisfaction: 92, patients: 580 },
                { month: 'Feb', satisfaction: 94, patients: 600 },
                { month: 'Mar', satisfaction: 95, patients: 620 },
                { month: 'Apr', satisfaction: 96.1, patients: 634 },
            ],
        },
        {
            id: 4,
            name: 'De-addiction',
            icon: Pill,
            satisfaction: 97.5,
            patients: 1123,
            avgRating: 4.9,
            responseRate: 94,
            nps: 85,
            waitTime: 15,
            staffRating: 4.9,
            facilityRating: 4.8,
            treatmentRating: 4.9,
            trend: 4.7,
            reviews: [
                { rating: 5, count: 978, name: '5 Star' },
                { rating: 4, count: 128, name: '4 Star' },
                { rating: 3, count: 15, name: '3 Star' },
                { rating: 2, count: 2, name: '2 Star' },
                { rating: 1, count: 0, name: '1 Star' },
            ],
            monthlyTrend: [
                { month: 'Jan', satisfaction: 94, patients: 1000 },
                { month: 'Feb', satisfaction: 96, patients: 1050 },
                { month: 'Mar', satisfaction: 97, patients: 1100 },
                { month: 'Apr', satisfaction: 97.5, patients: 1123 },
            ],
        },
        {
            id: 5,
            name: 'Couples therapy',
            icon: Shield,
            satisfaction: 87.3,
            patients: 2156,
            avgRating: 4.4,
            responseRate: 76,
            nps: 58,
            waitTime: 25,
            staffRating: 4.5,
            facilityRating: 4.2,
            treatmentRating: 4.6,
            trend: -2.1,
            reviews: [
                { rating: 5, count: 1234, name: '5 Star' },
                { rating: 4, count: 567, name: '4 Star' },
                { rating: 3, count: 234, name: '3 Star' },
                { rating: 2, count: 89, name: '2 Star' },
                { rating: 1, count: 32, name: '1 Star' },
            ],
            monthlyTrend: [
                { month: 'Jan', satisfaction: 90, patients: 2000 },
                { month: 'Feb', satisfaction: 89, patients: 2080 },
                { month: 'Mar', satisfaction: 88, patients: 2120 },
                { month: 'Apr', satisfaction: 87.3, patients: 2156 },
            ],
        },
    ];

    const filteredData = animatedData
        .filter(
            (dept) =>
                dept.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterCriteria === 'all' ||
                    (filterCriteria === 'excellent' && dept.satisfaction >= 95) ||
                    (filterCriteria === 'good' && dept.satisfaction >= 90 && dept.satisfaction < 95) ||
                    (filterCriteria === 'average' && dept.satisfaction < 90))
        )
        .sort((a, b) => {
            const aVal = (a as any)[sortBy];
            const bVal = (b as any)[sortBy];
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setAnimatedData(departmentData);
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const scrollToCard = (direction: 'next' | 'prev'): void => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const cardWidth = 400; // Approximate card width + gap

        if (direction === 'next') {
            setCurrentIndex((prev) => (prev + 1) % filteredData.length);
        } else {
            setCurrentIndex((prev) => (prev - 1 + filteredData.length) % filteredData.length);
        }

        const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    // Custom Tooltip Components
    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-white/20">
                    <p className="font-semibold text-gray-800">{`${label}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip: React.FC<CustomPieTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-white/20">
                    <p className="font-semibold text-gray-800">{`${data.name}: ${data.count} reviews`}</p>
                </div>
            );
        }
        return null;
    };

    interface DepartmentCardProps {
        dept: Department;
        index: number;
    }

    const DepartmentCard: React.FC<DepartmentCardProps> = ({ dept, index }) => {
        const IconComponent = dept.icon;
        const delay = index * 100;
        const pieColors = ['#2FA19A', '#18276c', '#20B2AA', '#4682B4', '#5F9EA0'];

        return (
            <div
                className="group relative bg-gradient-to-br from-[#18276c]/10 via-[#2FA19A]/10 to-[#18276c]/10
                          rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-[#2FA19A]/20
                          backdrop-blur-lg overflow-hidden flex-shrink-0
                          p-4 sm:p-6 md:p-8 transform transition-all duration-700 
                          hover:scale-105 hover:shadow-2xl hover:-translate-y-2
                          hover:bg-gradient-to-br hover:from-[#18276c]/20 hover:via-[#2FA19A]/20 hover:to-[#18276c]/20
                          w-80 sm:w-96"
                style={{
                    animationDelay: `${delay}ms`,
                    animation: 'slideInUp 0.8s ease-out forwards',
                }}
                // onMouseEnter={() => setHoveredDept(dept.id)}
                // onMouseLeave={() => setHoveredDept(null)}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl sm:rounded-2xl 
                                      bg-gradient-to-r from-[#18276c] via-[#2FA19A] to-[#18276c]
                                      flex items-center justify-center shadow-lg sm:shadow-2xl 
                                      transform group-hover:rotate-12 group-hover:scale-110 
                                      transition-all duration-500 border-2 border-white/20"
                        >
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl lg:text-2xl">
                                {dept.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#18276c]/70 font-medium">
                                <AnimatedCounter end={dept.patients} /> patients
                            </p>
                        </div>
                    </div>
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-[#18276c]/50 group-hover:text-[#2FA19A]" />
                </div>

                {/* Satisfaction Display */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <span className="text-sm sm:text-sm font-semibold text-[#18276c]/80 uppercase">
                                Satisfaction Rate
                            </span>
                            <ArrowRight className="w-4 h-4 text-[#18276c]/80" />
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-[#18276c] to-[#2FA19A] bg-clip-text text-transparent">
                                <AnimatedCounter end={dept.satisfaction} decimals={1} suffix="%" />
                            </span>
                            <div
                                className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                                    dept.trend > 0 ? 'text-[#2FA19A] bg-[#2FA19A]/20' : 'text-red-600 bg-red-100/80'
                                }`}
                            >
                                {dept.trend > 0 ? (
                                    <ArrowUp className="w-3 h-3 mr-1" />
                                ) : (
                                    <ArrowDown className="w-3 h-3 mr-1" />
                                )}
                                <AnimatedCounter end={Math.abs(dept.trend)} decimals={1} suffix="%" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div
                        className="text-center p-3 sm:p-4 bg-gradient-to-br from-white/60 to-white/40 
                                  backdrop-blur-md rounded-xl border border-white/30"
                    >
                        <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA19A] fill-current" />
                            <span className="text-lg sm:text-xl font-black text-[#18276c]">
                                <AnimatedCounter end={dept.avgRating} decimals={1} />
                            </span>
                        </div>
                        <p className="text-xs text-[#18276c]/70 font-semibold uppercase">Rating</p>
                    </div>
                    <div
                        className="text-center p-3 sm:p-4 bg-gradient-to-br from-white/60 to-white/40 
                                  backdrop-blur-md rounded-xl border border-white/30"
                    >
                        <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                            <Users className="w-5 h-5 text-[#2FA19A] " />
                            <span className="text-lg sm:text-xl font-black text-[#18276c]">
                                <AnimatedCounter end={dept.nps} />
                            </span>
                        </div>
                        <p className="text-xs text-[#18276c]/70 font-semibold uppercase">Nps</p>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="h-16 sm:h-20 md:h-24 mb-4 sm:mb-6 flex justify-center">
                    <ResponsiveContainer width={80} height={64}>
                        <PieChart>
                            <Pie
                                data={dept.reviews}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={30}
                                paddingAngle={3}
                                dataKey="count"
                                animationDuration={2000}
                                // animationDelay={delay}
                            >
                                {dept.reviews.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
                    <div
                        className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#2FA19A]/20 to-[#2FA19A]/10 
                                  backdrop-blur-md rounded-lg sm:rounded-xl border border-[#2FA19A]/20"
                    >
                        <div className="font-black text-[#18276c] text-sm sm:text-base">
                            <AnimatedCounter end={dept.responseRate} suffix="%" />
                        </div>
                        <div className="text-[#18276c]/70 font-semibold uppercase text-xs">Response</div>
                    </div>
                    <div
                        className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#18276c]/20 to-[#18276c]/10 
                                  backdrop-blur-md rounded-lg sm:rounded-xl border border-[#18276c]/20"
                    >
                        <div className="font-black text-[#18276c] text-sm sm:text-base">
                            <AnimatedCounter end={dept.waitTime} suffix="m" />
                        </div>
                        <div className="text-[#18276c]/70 font-semibold uppercase text-xs">Wait</div>
                    </div>
                    <div
                        className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#2FA19A]/20 to-[#2FA19A]/10 
                                  backdrop-blur-md rounded-lg sm:rounded-xl border border-[#2FA19A]/20"
                    >
                        <div className="font-black text-[#18276c] text-sm sm:text-base">
                            <AnimatedCounter end={dept.staffRating} decimals={1} />
                        </div>
                        <div className="text-[#18276c]/70 font-semibold uppercase text-xs">Staff</div>
                    </div>
                </div>
            </div>
        );
    };

    const DetailedCard: React.FC<DepartmentCardProps> = ({ dept, index }) => {
        const IconComponent = dept.icon;
        const delay = index * 50;
        const pieColors = ['#2FA19A', '#18276c', '#20B2AA', '#4682B4', '#5F9EA0'];

        return (
            <div
                className="group bg-gradient-to-br from-white/80 via-[#2FA19A]/5 to-[#18276c]/10 
                          rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-[#2FA19A]/20 
                          backdrop-blur-lg overflow-hidden transform transition-all duration-700 
                          hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2"
                style={{ animationDelay: `${delay}ms`, animation: 'slideInLeft 0.6s ease-out forwards' }}
            >
                <div className="p-4 sm:p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4 sm:space-x-6">
                            <div
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl 
                                          bg-gradient-to-r from-[#18276c] via-[#2FA19A] to-[#18276c] 
                                          flex items-center justify-center shadow-xl transform group-hover:scale-110 
                                          group-hover:rotate-12 transition-all duration-500 border-2 border-white/30"
                            >
                                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#18276c]">{dept.name}</h3>
                                <p className="text-sm sm:text-base md:text-lg text-[#18276c]/70 font-semibold">
                                    <AnimatedCounter end={dept.patients} /> patients served
                                </p>
                            </div>
                        </div>
                        <div
                            className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl 
                                       text-xs sm:text-sm font-bold ${
                                           dept.trend > 0
                                               ? 'text-[#2FA19A] bg-[#2FA19A]/20 border border-[#2FA19A]/30'
                                               : 'text-red-600 bg-red-100/80 border border-red-200'
                                       }`}
                        >
                            {dept.trend > 0 ? (
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            <AnimatedCounter end={Math.abs(dept.trend)} decimals={1} suffix="%" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Left: Satisfaction Radial Chart */}
                        <div className="lg:col-span-1">
                            <div className="text-center">
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 sm:mb-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="70%"
                                            outerRadius="90%"
                                            barSize={10}
                                            data={[
                                                { name: 'Satisfaction', value: dept.satisfaction, fill: '#2FA19A' },
                                                { name: 'Remaining', value: 100 - dept.satisfaction, fill: '#E5E7EB' },
                                            ]}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {/* <RadialBar background clockWise dataKey="value" cornerRadius={50} /> */}
                                        </RadialBarChart>
                                    </ResponsiveContainer>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#18276c] to-[#2FA19A] bg-clip-text text-transparent">
                                                <AnimatedCounter end={dept.satisfaction} decimals={1} suffix="%" />
                                            </div>
                                            <div className="text-xs sm:text-sm text-[#18276c]/70 font-semibold uppercase">
                                                Satisfaction
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle: Stats Cards */}
                        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div
                                    className="bg-gradient-to-br from-[#2FA19A]/20 via-white/60 to-[#2FA19A]/10 
             backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#2FA19A]/20"
                                >
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-xs sm:text-sm font-bold text-[#18276c]/80 uppercase">
                                            Rating
                                        </span>
                                    </div>

                                    {/* Number + Star */}
                                    <div className="flex items-center space-x-2 text-xl sm:text-2xl font-black text-[#18276c]">
                                        <AnimatedCounter end={dept.avgRating} decimals={1} />
                                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                    </div>
                                </div>

                                <div
                                    className="bg-gradient-to-br from-[#18276c]/20 via-white/60 to-[#18276c]/10 
                                              backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#18276c]/20"
                                >
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        <span className="text-xs sm:text-sm font-bold text-[#18276c]/80 uppercase">
                                            NPS
                                        </span>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-[#18276c]">
                                        <AnimatedCounter end={dept.nps} />
                                    </div>
                                </div>

                                <div
                                    className="bg-gradient-to-br from-[#2FA19A]/20 via-white/60 to-[#2FA19A]/10 
                                              backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#2FA19A]/20"
                                >
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#18276c]" />
                                        <span className="text-xs sm:text-sm font-bold text-[#18276c]/80 uppercase">
                                            Response
                                        </span>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-[#18276c]">
                                        <AnimatedCounter end={dept.responseRate} suffix="%" />
                                    </div>
                                </div>

                                <div
                                    className="bg-gradient-to-br from-[#18276c]/20 via-white/60 to-[#18276c]/10 
                                              backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#18276c]/20"
                                >
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA19A]" />
                                        <span className="text-xs sm:text-sm font-bold text-[#18276c]/80 uppercase">
                                            Wait
                                        </span>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-[#18276c]">
                                        <AnimatedCounter end={dept.waitTime} suffix="m" />
                                    </div>
                                </div>
                            </div>

                            {/* Trend Chart */}
                            <div
                                className="bg-gradient-to-br from-white/70 via-[#2FA19A]/5 to-white/50 
                                          backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30"
                            >
                                <h4 className="text-base sm:text-lg font-black text-[#18276c] mb-3 sm:mb-4 uppercase">
                                    Monthly Trend
                                </h4>
                                <div className="h-24 sm:h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dept.monthlyTrend}>
                                            <defs>
                                                <linearGradient id={`colorGradient${dept.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2FA19A" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#18276c" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 10, fill: '#18276c' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis hide />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="satisfaction"
                                                stroke="#2FA19A"
                                                strokeWidth={2}
                                                fill={`url(#colorGradient${dept.id})`}
                                                animationDuration={2500}
                                                // animationDelay={delay + 500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Right: Review Distribution */}
                        <div className="lg:col-span-1">
                            <div className="space-y-4 sm:space-y-6">
                                {/* Donut Chart */}
                                <div
                                    className="bg-gradient-to-br from-white/70 via-[#18276c]/5 to-white/50 
                                                backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30"
                                >
                                    <h4 className="text-base sm:text-lg font-black text-[#18276c] mb-3 sm:mb-4 uppercase">
                                        Reviews
                                    </h4>
                                    <div className="h-32 sm:h-40 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={dept.reviews}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={30}
                                                    outerRadius={55}
                                                    paddingAngle={4}
                                                    dataKey="count"
                                                    animationDuration={2500}
                                                    // animationDelay={delay + 200}
                                                >
                                                    {dept.reviews.map((_, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={pieColors[index % pieColors.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomPieTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Rating Breakdown */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h4 className="text-base sm:text-lg font-black text-[#18276c] uppercase">Breakdown</h4>
                                    {dept.reviews.map((review, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 sm:space-x-4">
                                            <div className="flex items-center space-x-1 sm:space-x-2 w-12 sm:w-16">
                                                <span className="text-xs sm:text-sm font-bold text-[#18276c]">
                                                    {review.rating}
                                                </span>
                                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                                            </div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1500"
                                                    style={{
                                                        background: `linear-gradient(90deg, ${
                                                            pieColors[idx % pieColors.length]
                                                        }, ${pieColors[idx % pieColors.length]}aa)`,
                                                        width: `${
                                                            (review.count / Math.max(...dept.reviews.map((r) => r.count))) *
                                                            100
                                                        }%`,
                                                        animationDelay: `${delay + idx * 150}ms`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs sm:text-sm font-bold text-[#18276c] w-8 sm:w-12">
                                                <AnimatedCounter end={review.count} duration={1800} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-4 sm:gap-6">
                        <div
                            className="text-center p-3 sm:p-4 bg-gradient-to-br from-[#2FA19A]/20 via-white/60 to-[#2FA19A]/10 
                                        backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#2FA19A]/20"
                        >
                            <div className="text-lg sm:text-xl md:text-2xl font-black text-[#18276c]">
                                <AnimatedCounter end={dept.staffRating} decimals={1} />
                            </div>
                            <div className="text-xs sm:text-sm text-[#18276c]/70 font-bold uppercase">Staff</div>
                        </div>
                        <div
                            className="text-center p-3 sm:p-4 bg-gradient-to-br from-[#18276c]/20 via-white/60 to-[#18276c]/10 
                                        backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#18276c]/20"
                        >
                            <div className="text-lg sm:text-xl md:text-2xl font-black text-[#18276c]">
                                <AnimatedCounter end={dept.facilityRating} decimals={1} />
                            </div>
                            <div className="text-xs sm:text-sm text-[#18276c]/70 font-bold uppercase">Facility</div>
                        </div>
                        <div
                            className="text-center p-3 sm:p-4 bg-gradient-to-br from-[#2FA19A]/20 via-white/60 to-[#2FA19A]/10 
                                        backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#2FA19A]/20"
                        >
                            <div className="text-lg sm:text-xl md:text-2xl font-black text-[#18276c]">
                                <AnimatedCounter end={dept.treatmentRating} decimals={1} />
                            </div>
                            <div className="text-xs sm:text-sm text-[#18276c]/70 font-bold uppercase">Treatment</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#18276c]/10 via-[#2FA19A]/5 to-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-[#2FA19A]/30 border-t-[#18276c] rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-3 border-[#18276c]/30 border-t-[#2FA19A] rounded-full animate-spin"></div>
                        </div>
                    </div>
                    <p className="text-[#18276c] font-black text-base sm:text-lg md:text-xl animate-pulse bg-gradient-to-r from-[#18276c] to-[#2FA19A] bg-clip-text text-transparent">
                        Loading Dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#c9f4ec] pb-10 ">
            {/* Header */}
            <div className="text-center py-6 sm:py-8 md:py-12 px-4">
                <h1
                    className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight6"
                >
                    Department Analytics
                </h1>
            </div>
            
            {/* Content */}
            <div className="px-4 sm:px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {selectedView === 'grid' ? (
                        // Horizontal Scrolling Cards
                        <div className="relative">
                            {/* Cards Container */}
                            <div
                                ref={scrollContainerRef}
                                className="flex items-center space-x-6 overflow-x-auto  rounded-2xl sm:rounded-3xl scrollbar-hide px-16 py-4  bg-gradient-to-t from-[#aef0e6] via-white to-[#aef0e6]
                                            snap-x snap-mandatory"
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                {filteredData.map((dept, index) => (
                                    <div key={dept.id} className="snap-center flex-shrink-0">
                                        <DepartmentCard dept={dept} index={index} />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Indicators with Buttons */}
                            <div className="flex items-center justify-between mt-8 space-x-4">
                                {/* Left Button */}
                                <button
                                    onClick={() => scrollToCard('prev')}
                                    className="w-6 h-6 bg-gradient-to-r from-[#18276c] to-[#2FA19A] 
                                    rounded-full flex items-center justify-center shadow-md 
                                    hover:shadow-lg hover:scale-110 transition-all duration-300 text-white"
                                >
                                    <ChevronLeft className="w-5 h-4" />
                                </button>

                                {/* Indicators */}
                                <div className="flex space-x-2">
                                    {filteredData.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                index === currentIndex ? 'bg-[#2FA19A] scale-125' : 'bg-[#18276c]/30'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Right Button */}
                                <button
                                    onClick={() => scrollToCard('next')}
                                    className="w-6 h-6 bg-gradient-to-r from-[#18276c] to-[#2FA19A] 
                                    rounded-full flex items-center justify-center shadow-md 
                                    hover:shadow-lg hover:scale-110 transition-all duration-300 text-white"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 sm:space-y-8">
                            {filteredData.map((dept, index) => (
                                <DetailedCard key={dept.id} dept={dept} index={index} />
                            ))}
                        </div>
                    )}

                    {filteredData.length === 0 && (
                        <div className="text-center py-12 sm:py-16">
                            <div
                                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#2FA19A]/20 to-[#18276c]/20 
                                            rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                            >
                                <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 text-[#18276c]/60" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#18276c] mb-2 sm:mb-3">
                                No departments found
                            </h3>
                            <p className="text-sm sm:text-base md:text-lg text-[#18276c]/70">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
                <button
                    className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 bg-[#2FA19A]  
                    transform hover:scale-105 transition-transform duration-300 ease-in-out
                    text-sm sm:text-sm md:text-base lg:text-lg tracking-wide 
                    text-white rounded-full shadow-xl hover:shadow-2xl 
                    border border-white/20 hover:border-white/40"
                >
                    Book Appointment
                </button>
            </div>

            <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default DepartmentGraphs;