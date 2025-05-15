import { RegisterForm } from '@/components/auth/register-form';

export default function Register() {
  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <RegisterForm />
      </div>
      
      {/* Image side */}
      <div className="hidden lg:block lg:w-1/2 bg-primary relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=1600" 
          alt="Person planning a routine in a notebook" 
          className="absolute inset-0 w-full h-full object-cover opacity-75 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-800 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white">
          <h2 className="text-4xl font-bold mb-6 text-center">Build Better Habits, One Day at a Time</h2>
          <p className="text-lg text-center mb-8 max-w-md">PacePal helps you create, track and maintain positive routines that stick with you for life.</p>
          
          <div className="grid grid-cols-2 gap-6 max-w-lg w-full">
            {/* Feature 1 */}
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-bold mb-2">Daily Routines</h3>
              <p className="text-sm text-white text-opacity-90">Create customized routines for morning, work, and evening</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="font-bold mb-2">SMS Reminders</h3>
              <p className="text-sm text-white text-opacity-90">Get timely notifications via text message</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="font-bold mb-2">Progress Tracking</h3>
              <p className="text-sm text-white text-opacity-90">Visualize your consistency and improvement</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-bold mb-2">Habit Calendar</h3>
              <p className="text-sm text-white text-opacity-90">Plan your habits with an intuitive calendar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
