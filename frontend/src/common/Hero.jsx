import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-slate-50 overflow-hidden">

      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-teal-50/50 rounded-l-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content (Unchanged) */}
        <div className="space-y-8 max-w-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
            Automate Your Workflow <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              With LOR Automation
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            We build intelligent automation systems that improve efficiency,
            reduce manual work, and scale your business faster.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              Get Started <span>&rarr;</span>
            </Link>

            <Link
              to="/about"
              className="px-8 py-3.5 rounded-lg font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Content - Single Block with Background Image */}
        <div className="hidden md:flex justify-center relative">

          {/* Single Block Container
            - Replace the URL inside style={{ backgroundImage: ... }} with your real image
          */}
          <div
            className="w-[500px] h-[500px] rounded-3xl shadow-2xl overflow-hidden relative flex items-end p-8 border border-slate-200 transform rotate-1 hover:rotate-0 transition-transform duration-500"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Dark Gradient Overlay (Makes text readable over the image) */}
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/40 to-transparent"></div>

            {/* Content inside the block */}
            <h2 className="relative z-10 text-3xl font-bold text-white leading-tight">
              Automation Dashboard <br/> Preview
            </h2>
          </div>

          {/* Decorative floating circles */}
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
