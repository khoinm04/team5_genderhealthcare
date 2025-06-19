export const mockStaff = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    phone: '0123456789',
    position: 'Quản lý',
    department: 'Kinh doanh',
    startDate: '2023-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@company.com',
    phone: '0987654321',
    position: 'Nhân viên',
    department: 'Kỹ thuật',
    startDate: '2023-03-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Lê Minh Cường',
    email: 'cuong.le@company.com',
    phone: '0345678912',
    position: 'Trưởng phòng',
    department: 'Marketing',
    startDate: '2022-11-10',
    status: 'inactive'
  }
];

export const mockConsultants = [
  {
    id: '1',
    name: 'Dr. Phạm Thị Dung',
    email: 'dung.pham@company.com',
    phone: '0111222333',
    specialization: 'Tư vấn tài chính',
    experience: 8,
    rating: 4.8,
    status: 'available'
  },
  {
    id: '2',
    name: 'ThS. Hoàng Văn Em',
    email: 'em.hoang@company.com',
    phone: '0444555666',
    specialization: 'Tư vấn pháp lý',
    experience: 5,
    rating: 4.6,
    status: 'busy'
  },
  {
    id: '3',
    name: 'Ts. Ngô Thị Phượng',
    email: 'phuong.ngo@company.com',
    phone: '0777888999',
    specialization: 'Tư vấn kinh doanh',
    experience: 12,
    rating: 4.9,
    status: 'available'
  }
];

export const mockServices = [
  {
    id: '1',
    name: 'Tư vấn đầu tư',
    description: 'Tư vấn chiến lược đầu tư và quản lý danh mục',
    price: 500000,
    duration: 60,
    category: 'Tài chính',
    status: 'active'
  },
  {
    id: '2',
    name: 'Tư vấn pháp lý doanh nghiệp',
    description: 'Hỗ trợ pháp lý cho doanh nghiệp và khởi nghiệp',
    price: 800000,
    duration: 90,
    category: 'Pháp lý',
    status: 'active'
  },
  {
    id: '3',
    name: 'Tư vấn marketing số',
    description: 'Chiến lược marketing online và số hóa',
    price: 600000,
    duration: 75,
    category: 'Marketing',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Xét nghiệm HIV',
    description: 'Xét nghiệm phát hiện virus HIV',
    price: 200000,
    duration: 30,
    category: 'Y tế',
    status: 'active'
  },
  {
    id: '5',
    name: 'Xét nghiệm lậu (Gonorrhea)',
    description: 'Xét nghiệm phát hiện vi khuẩn lậu',
    price: 150000,
    duration: 30,
    category: 'Y tế',
    status: 'active'
  },
  {
    id: '6',
    name: 'Xét nghiệm giang mai (Syphilis)',
    description: 'Xét nghiệm phát hiện vi khuẩn giang mai',
    price: 180000,
    duration: 30,
    category: 'Y tế',
    status: 'active'
  },
  {
    id: '7',
    name: 'Xét nghiệm Chlamydia',
    description: 'Xét nghiệm phát hiện vi khuẩn Chlamydia',
    price: 170000,
    duration: 30,
    category: 'Y tế',
    status: 'active'
  }
];

export const mockSchedules = [
  {
    id: '1',
    personId: '1',
    personName: 'Dr. Phạm Thị Dung',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '10:00',
    client: 'Nguyễn Văn A',
    service: 'Tư vấn đầu tư',
    status: 'scheduled'
  },
  {
    id: '2',
    personId: '2',
    personName: 'ThS. Hoàng Văn Em',
    date: '2024-01-15',
    startTime: '14:00',
    endTime: '15:30',
    client: 'Công ty ABC',
    service: 'Tư vấn pháp lý doanh nghiệp',
    status: 'completed'
  },
  {
    id: '3',
    personId: '1',
    personName: 'Dr. Phạm Thị Dung',
    date: '2024-01-16',
    startTime: '10:00',
    endTime: '10:30',
    client: 'Trần Văn B',
    service: 'Xét nghiệm HIV',
    status: 'scheduled'
  }
];