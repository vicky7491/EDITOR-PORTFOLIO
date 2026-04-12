import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axiosAdmin from "@/api/axiosAdmin";


const EMPTY = {
  name: "",
  price: "",
  priceLabel: "",
  badge: "",
  bestFor: "",
  features: "",
  isCustom: false,
  ctaText: "Book A Call",
  ctaLink: "/contact",
  isActive: true,
  order: 0,
};

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    axiosAdmin
      .get("/api/plans/all")
      .then((r) => setPlans(r.data.data || []))
      .catch(() => toast.error("Failed to load plans"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setModal(true);
  };

  const openEdit = (plan) => {
    setEditing(plan);
    setForm({
      ...plan,
      features: (plan.features || []).join("\n"),
    });
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Plan name is required");
    setSaving(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
        features: form.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editing) {
        await axiosAdmin.put(`/api/plans/${editing._id}`, payload);
        toast.success("Plan updated");
      } else {
        await axiosAdmin.post("/api/plans", payload);
        toast.success("Plan created");
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await axiosAdmin.delete(`/api/plans/${id}`);
      toast.success("Plan deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            Pricing Plans
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage the pricing plan cards shown on the Services page
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + Add Plan
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="glass-card p-10 text-center text-slate-500 text-sm">
          No plans yet. Click <span className="text-slate-300">+ Add Plan</span>{" "}
          to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="glass-card p-5 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-100 font-medium">
                    {plan.name}
                  </span>
                  {plan.badge && (
                    <span
                      className="relative text-xs font-semibold text-white
                   px-3 py-1 rounded-full
                   bg-gradient-to-r from-purple-500 to-indigo-500
                   shadow-lg shadow-purple-500/30
                   animate-pulse"
                    >
                      {plan.badge}
                    </span>
                  )}
                  {plan.isCustom && (
                    <span
                      className="text-xs text-slate-500 bg-white/5
                                     px-2 py-0.5 rounded-full"
                    >
                      Custom
                    </span>
                  )}
                  {!plan.isActive && (
                    <span className="text-xs text-slate-600">(inactive)</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {plan.isCustom
                    ? "Custom pricing — no price shown"
                    : `${plan.price}${plan.priceLabel ? ` · ${plan.priceLabel}` : ""}`}
                  {plan.features?.length
                    ? ` · ${plan.features.length} features`
                    : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(plan)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="btn-danger text-xs py-1.5 px-3"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50
                       flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="bg-[#0f1117] border border-white/10 rounded-2xl
                         w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-slate-100 font-semibold">
                  {editing ? "Edit Plan" : "New Plan"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-100 transition-colors
                             text-xl leading-none w-7 h-7 flex items-center justify-center
                             rounded-lg hover:bg-white/5"
                >
                  ×
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-4">
                {[
                  ["name", "Plan Name *", "text", "Basic"],
                  ["price", "Price", "text", "$1499/month"],
                  ["priceLabel", "Price Label", "text", "15 short videos"],
                  ["badge", "Badge (optional)", "text", "Recommended"],
                  [
                    "bestFor",
                    "Best For (caption)",
                    "text",
                    "Best for coaches & trainers",
                  ],
                  ["ctaText", "CTA Button Text", "text", "Book A Call"],
                  ["ctaLink", "CTA Link", "text", "/contact"],
                  ["order", "Sort Order", "number", "0"],
                ].map(([name, label, type, ph]) => (
                  <div key={name}>
                    <label className="admin-label">{label}</label>
                    <input
                      name={name}
                      type={type}
                      placeholder={ph}
                      value={form[name]}
                      onChange={handleChange}
                      className="admin-input"
                    />
                  </div>
                ))}

                <div>
                  <label className="admin-label">Features (one per line)</label>
                  <textarea
                    name="features"
                    rows={6}
                    value={form.features}
                    onChange={handleChange}
                    placeholder={
                      "World-class editor\nUnlimited revisions\n24/7 Chat support"
                    }
                    className="admin-input resize-none"
                  />
                </div>

                <div className="space-y-3 pt-1 border-t border-white/5">
                  {[
                    ["isCustom", "Custom plan (hides price, shows CTA only)"],
                    ["isActive", "Active (visible on site)"],
                  ].map(([name, label]) => (
                    <div key={name} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={!!form[name]}
                        onChange={handleChange}
                        className="w-4 h-4 accent-brand-500"
                      />
                      <label
                        htmlFor={name}
                        className="text-sm text-slate-300 cursor-pointer"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex gap-3 p-6 border-t border-white/5">
                <button onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? "Saving…" : editing ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlansPage;
