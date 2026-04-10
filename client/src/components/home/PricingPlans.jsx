import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { getPlans } from "@/api/publicApi";
import { staggerContainer, staggerItem } from "@/utils/motion";

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getPlans()
      .then((r) => setPlans(r.data.data || []))
      .catch(() => {});
  }, []);

  if (!plans.length) return null;

  return (
    <section className="section">
      <div className="max-w-7xl mx-auto my-20 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={staggerItem} className="mb-14 text-center">
            <span className="section-tag justify-center">
              <span className="w-6 h-px bg-violet-400" />
              Pricing
            </span>
            <h2 className="font-display text-4xl text-white uppercase">
              Choose Your Plan
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
              Transparent pricing built around your growth goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan._id}
                variants={staggerItem}
                className={`glass p-8 rounded-2xl flex flex-col relative transition-all duration-300
  ${
    plan.badge
      ? "border-transparent bg-gradient-to-r from-purple-500/20 to-indigo-500/20 shadow-xl shadow-purple-500/20 scale-105"
      : "hover:border-violet-500/20 hover:scale-[1.02]"
  }`}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2
                     text-xs font-semibold text-white
                     px-4 py-1 rounded-full
                     bg-gradient-to-r from-purple-500 to-indigo-500
                     shadow-lg shadow-purple-500/30
                     animate-pulse"
                  >
                    {plan.badge}
                  </span>
                )}

                <h3 className="font-display text-2xl text-white uppercase mb-1">
                  {plan.name}
                </h3>

                {!plan.isCustom ? (
                  <div className="mb-2">
                    <span className="text-violet-400 text-3xl font-bold">
                      {plan.price}
                    </span>
                    {plan.priceLabel && (
                      <p className="text-slate-500 text-sm mt-1">
                        ({plan.priceLabel})
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm mb-2">
                    Let's build something tailored to you.
                  </p>
                )}

                <Link
                  to={plan.ctaLink || "/contact"}
                  className={`w-full text-sm mt-2 mb-6 inline-flex items-center justify-center
    px-5 py-2.5 rounded-xl font-semibold transition-all duration-300
    ${
      plan.badge
        ? "text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/30 hover:scale-[1.02]"
        : "text-purple-300 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/50"
    }`}
                >
                  {plan.badge
                    ? "Get Started 🚀"
                    : plan.ctaText || "Book A Call"}
                </Link>

                {plan.features?.length > 0 && (
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-400"
                      >
                        <Check
                          size={14}
                          className="text-violet-400 mt-0.5 shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {plan.bestFor && (
                  <p className="text-xs text-slate-600 mt-6 pt-4 border-t border-white/5">
                    {plan.bestFor}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingPlans;
