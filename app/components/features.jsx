import React from 'react'

function Feature() {
  return (
    <div>
      <section className="m-4 md:m-8 dark:bg-gray-100 dark:text-gray-800">
        <div className="container mx-auto p-4 my-6 space-y-2 text-center">
          <h2 className="text-5xl font-bold">HealthBuddy: Empower Your Health Journey</h2>
          <p className="dark:text-gray-600">Manage your nutrition, fitness, and medical needs with ease.</p>
        </div>
        <div className="container mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-semibold">Calorie Counting</h3>
            <div className="space-y-1 leading-tight">
              <p>Track your daily calorie intake easily.</p>
              <p>Get insights into the nutritional value of your meals.</p>
              <p>Achieve your health goals by staying on top of your diet.</p>
            </div>
          </div>
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-semibold">Fitness Routines</h3>
            <div className="space-y-1 leading-tight">
              <p>Personalized workout routines tailored to your fitness level.</p>
              <p>Track your workouts and progress over time.</p>
              <p>Stay motivated with fitness challenges and goals.</p>
            </div>
          </div>
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-semibold">Medical Intake Tracking</h3>
            <div className="space-y-1 leading-tight">
              <p>Track your medication schedule and daily intake.</p>
              <p>Set reminders for your medical prescriptions.</p>
              <p>Stay on top of your health with regular monitoring.</p>
            </div>
          </div>
         
          
          
        </div>
      </section>
    </div>
  )
}

export default Feature
