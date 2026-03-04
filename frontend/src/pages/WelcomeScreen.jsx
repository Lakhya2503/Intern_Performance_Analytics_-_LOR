import { useEffect, useState } from "react";
import { AthnuraTitleImage } from "../../public/images";
import { ArrowBigLeftDash, ArrowBigRight, ArrowBigRightDashIcon } from "lucide-react";
import { LuCircleArrowOutDownRight } from "react-icons/lu";
import { GiPaperArrow } from "react-icons/gi";
import { TbArrowBigRightFilled } from "react-icons/tb";

function WelcomeScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start 3-second timer
    const timer = setTimeout(() => setFadeOut(true), 3000); // fade starts a bit before finish
    const finishTimer = setTimeout(() => onFinish(), 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 z-50 transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[87rem] w-full flex flex-col lg:flex-row items-center justify-between gap-40 bg-transparent rounded-3xl p-2 lg:p-12  border-white/20 relative z-10">
        {/* Left Content */}
        <div className="flex-1 text-left space-y-6">
          {/* Logo/Header with Image */}
          <div className="flex items-center gap-4 mb-4">

              {/* Replace this with your actual logo image */}
              <img
                src={AthnuraTitleImage}
                alt="LOR Automation Logo"
                className="w-15 h-15 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-white text-2xl font-bold">LOR</span>';
                }}
              />
            <span className="text-sm font-semibold text-blue-600 tracking-wider bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-2.5 rounded-full border border-blue-100 shadow-sm">
              🚀 INTELLIGENT AUTOMATION
            </span>
          </div>

          {/* Heading with Gradient Text */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              Automate Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent animate-gradient">
              Workflow
            </span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-700 font-bold">
              With LOR Automation
            </span>
          </h1>

          {/* Paragraph with Highlight */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg">
            We build intelligent automation systems that improve{" "}
            <span className="text-blue-600 font-semibold">efficiency</span>,
            reduce <span className="text-blue-600 font-semibold">manual work</span>, and{" "}
            <span className="text-blue-600 font-semibold">scale</span> your business faster.
          </p>


          {/* CTA Section */}
          <div className="pt-6 space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
              Ready to Automate Your Workflow?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
             <button
                    onClick={() => {
                      setFadeOut(true);
                      setTimeout(onFinish, 300);
                    }}
                    className="group relative px-10 py-5 text-lg font-semibold text-blue-500
                      bg-gradient-to-br from-white/20 to-white/5
                      backdrop-blur-xl rounded-2xl
                      shadow-2xl shadow-blue-500/20
                      hover:shadow-blue-400/30
                      border border-blue-300 hover:border-blue-700
                      animate-[float_3s_ease-in-out_infinite]
                      hover:scale-105 active:scale-95
                      transition-all duration-500
                      tracking-wide inline-flex items-center justify-center gap-3
                      overflow-hidden"
                  >
                    <span className="relative z-10 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-blue-800">
                      Get Started Now
                    </span>
                    <span className="relative z-10 group-hover:translate-x-2  transition-all duration-300">
                      <TbArrowBigRightFilled    className="w-6 h-6 filter drop-shadow-lg" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]"></div>
                  </button>
            </div>



          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 flex justify-center items-center relative">
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl animate-pulse animation-delay-1000"></div>

          {/* Main Image with Overlay Effects */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Team collaborating on automation"
              className="w-full max-w-md lg:max-w-lg h-auto rounded-2xl shadow-2xl relative z-10 transform group-hover:scale-105 transition-all duration-500"
            />

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-20 max-w-[200px] border border-white/50 transform hover:scale-105 transition-all duration-300 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Efficiency Boost</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">85%</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-20 border border-white/50 transform hover:scale-105 transition-all duration-300 animate-float animation-delay-2000">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">⏱️</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Time Saved</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">40h/mo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default WelcomeScreen;
