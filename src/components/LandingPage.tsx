import React from 'react';
import { 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  FileText, 
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Globe,
  Clock,
  CreditCard
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI หลายค่าย ในที่เดียว',
      description: 'เข้าถึง ChatGPT, Claude, Gemini, Perplexity และอื่นๆ ผ่านแพลตฟอร์มเดียว',
      color: 'bg-blue-500'
    },
    {
      icon: CreditCard,
      title: 'จ่ายตามใช้จริง',
      description: 'ไม่มีค่าธรรมเนียมรายเดือน จ่ายเฉพาะการใช้งานจริงเท่านั้น',
      color: 'bg-green-500'
    },
    {
      icon: Shield,
      title: 'ปลอดภัย 100%',
      description: 'ข้อมูลของคุณจัดเก็บใน Google Drive หรือ OneDrive ของคุณเอง',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'ทำงานเป็นทีม',
      description: 'แชร์ผลงานและค่าใช้จ่ายกับทีมได้อย่างง่ายดาย',
      color: 'bg-orange-500'
    },
    {
      icon: FileText,
      title: 'วิเคราะห์เอกสาร',
      description: 'อัปโหลดเอกสาร PDF, Word, Excel เพื่อวิเคราะห์และสรุปเนื้อหา',
      color: 'bg-red-500'
    },
    {
      icon: BarChart3,
      title: 'ตรวจสอบข้อมูล',
      description: 'ระบบตรวจสอบความถูกต้องตามหลักวิชาการก่อนส่งรายงาน',
      color: 'bg-teal-500'
    }
  ];

  const pricing = [
    {
      name: 'นักเรียน/นักศึกษา',
      price: '0',
      period: 'ฟรี 1,000 เครดิต/เดือน',
      features: [
        'AI Chat พื้นฐาน',
        'วิเคราะห์เอกสาร 10 ไฟล์/เดือน',
        'ทีมสูงสุด 3 คน',
        'รองรับไฟล์ขนาดสูงสุด 10MB'
      ],
      popular: false
    },
    {
      name: 'พนักงาน/ข้าราชการ',
      price: '199',
      period: 'เริ่มต้น/เดือน + จ่ายตามใช้',
      features: [
        'AI Chat ไม่จำกัด',
        'วิเคราะห์เอกสารไม่จำกัด',
        'ทีมสูงสุด 10 คน',
        'รองรับไฟล์ขนาดสูงสุด 100MB',
        'บันทึกการประชุม',
        'ตรวจสอบข้อมูลด้วย AI'
      ],
      popular: true
    },
    {
      name: 'องค์กร/หน่วยงาน',
      price: 'ติดต่อ',
      period: 'ราคาพิเศษ',
      features: [
        'ฟีเจอร์ครบทุกอย่าง',
        'ทีมไม่จำกัด',
        'API Integration',
        'Support 24/7',
        'On-premise deployment',
        'Custom AI Models'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'ดร. สมชาย วิทยากร',
      role: 'นักวิจัย มหาวิทยาลัยเชียงใหม่',
      content: 'ช่วยลดเวลาการวิเคราะห์เอกสารวิจัยได้มากกว่า 80% และประหยัดค่าใช้จ่ายมาก',
      rating: 5
    },
    {
      name: 'คุณปัทมา ธุรกิจ',
      role: 'ผู้จัดการโครงการ บริษัท ABC',
      content: 'ทีมของเราใช้ร่วมกันได้ง่าย และจ่ายเฉพาะที่ใช้จริง ประหยัดกว่าซับสคริปชั่นแยกกัน',
      rating: 5
    },
    {
      name: 'คุณอนุชา นักศึกษา',
      role: 'นักศึกษาปริญญาโท จุฬาฯ',
      content: 'ฟรีเครดิต 1,000 ต่อเดือนเพียงพอสำหรับทำวิทยานิพนธ์ ไม่ต้องเสียเงินเพิ่ม',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ThaiAI
              </span>
              <br />
              ผู้ช่วย AI ที่จ่ายตามใช้จริง
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              เข้าถึง AI หลายค่ายในแพลตฟอร์มเดียว ไม่มีค่าธรรมเนียมรายเดือน 
              จ่ายเฉพาะการใช้งานจริง เหมาะสำหรับคนไทยทุกอาชีพ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onLogin}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                เริ่มใช้งานฟรี
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors">
                ดูตัวอย่าง
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ทำไมต้อง ThaiAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              เราออกแบบมาเพื่อคนไทยโดยเฉพาะ เข้าใจความต้องการและงบประมาณของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              แพ็คเกจที่เหมาะกับคุณ
            </h2>
            <p className="text-xl text-gray-600">
              เริ่มต้นฟรี อัปเกรดตามความต้องการ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div key={index} className={`
                bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-lg'}
                hover:shadow-xl transition-shadow relative
              `}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      แนะนำ
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {plan.price === 'ติดต่อ' ? plan.price : `฿${plan.price}`}
                  </div>
                  <p className="text-gray-600">{plan.period}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`
                  w-full py-3 rounded-xl font-semibold transition-colors
                  ${plan.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }
                `}>
                  {plan.price === 'ติดต่อ' ? 'ติดต่อเรา' : 'เลือกแพ็คเกจ'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ผู้ใช้งานพูดถึงเรา
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            เริ่มต้นใช้งาน AI วันนี้
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            ฟรีเครดิต 1,000 เครดิต สำหรับการใช้งานครั้งแรก
          </p>
          <button 
            onClick={onLogin}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            เริ่มใช้งานฟรี
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;