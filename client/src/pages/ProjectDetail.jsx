import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { getProjectBySlug, incrementProjectView } from "@/api/publicApi";
import { useSite } from "@/context/SiteContext";
import { staggerContainer, staggerItem } from "@/utils/motion";
import VideoEmbed from "@/components/ui/VideoEmbed";
import LazyImage from "@/components/ui/LazyImage";

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useSite();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sliderPos, setSliderPos] = useState(50);

  useEffect(() => {
    setIsLoading(true);
    getProjectBySlug(slug)
      .then((r) => {
        setProject(r.data.data);
        incrementProjectView(slug).catch(() => {});
      })
      .catch(() => navigate("/portfolio", { replace: true }))
      .finally(() => setIsLoading(false));
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-900 pt-32 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-8 w-48 rounded-lg bg-night-800 animate-pulse" />
          <div className="aspect-video rounded-2xl bg-night-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  const hasBeforeAfter =
    project.beforeAfter?.before?.url && project.beforeAfter?.after?.url;

  return (
    <>
      <Helmet>
        <title>
          {project.title} — {settings.siteTitle || "VickyVfx"}
        </title>
        <meta name="description" content={project.shortDescription || ""} />
        {project.thumbnail?.url && (
          <meta property="og:image" content={project.thumbnail.url} />
        )}
      </Helmet>

      <div className="min-h-screen bg-night-900 pt-24">
        {/* ── Hero media ──────────────────────────────────────────────────── */}
        <section className="relative">
          {project.videoUrl ? (
            <VideoEmbed
              url={project.videoUrl}
              poster={project.thumbnail?.url}
              title={project.title}
              className="w-full max-h-[70vh] rounded-none"
              controls
            />
          ) : project.thumbnail?.url ? (
            <LazyImage
              src={project.thumbnail.url}
              alt={project.title}
              className="w-full max-h-[60vh]"
              objectFit="cover"
            />
          ) : null}
        </section>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Breadcrumb */}
            <motion.div variants={staggerItem} className="mb-8">
              <Link
                to="/portfolio"
                className="text-sm text-slate-500 hover:text-violet-400
                               transition-colors flex items-center gap-1"
              >
                ← Back to portfolio
              </Link>
            </motion.div>

            {/* Title row */}
            <motion.div
              variants={staggerItem}
              className="flex flex-wrap items-start justify-between gap-4 mb-8"
            >
              <div>
                {project.category && (
                  <span
                    className="inline-block text-xs px-3 py-1 rounded-full
                               tracking-widest uppercase mb-3"
                    style={{
                      background: `${project.category.color}18`,
                      color: project.category.color,
                      border: `1px solid ${project.category.color}35`,
                    }}
                  >
                    {project.category.name}
                  </span>
                )}
                <h1 className="font-display text-4xl sm:text-5xl text-white uppercase">
                  {project.title}
                </h1>
              </div>
              {project.externalLink && (
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-sm"
                >
                  View live ↗
                </a>
              )}
            </motion.div>

            {/* Meta grid */}
            <motion.div
              variants={staggerItem}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
            >
              {[
                { label: "Client", value: project.clientName },
                {
                  label: "Year",
                  value: project.projectDate
                    ? new Date(project.projectDate).getFullYear()
                    : null,
                },
                { label: "Category", value: project.category?.name },
                { label: "Views", value: project.views || 0 },
              ]
                .filter((m) => m.value)
                .map((m) => (
                  <div key={m.label} className="glass p-4 rounded-xl">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">
                      {m.label}
                    </p>
                    <p className="text-sm font-medium text-slate-300">
                      {m.value}
                    </p>
                  </div>
                ))}
            </motion.div>

            {/* Description */}
            {project.description && (
              <motion.div variants={staggerItem} className="mb-10">
                <h2 className="font-display text-2xl text-white uppercase mb-4">
                  About this project
                </h2>
                <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </motion.div>
            )}

            {/* Software */}
            {project.softwareUsed?.length > 0 && (
              <motion.div variants={staggerItem} className="mb-10">
                <h2 className="font-display text-2xl text-white uppercase mb-4">
                  Tools Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.softwareUsed.map((sw) => (
                    <span
                      key={sw}
                      className="glass text-sm text-slate-400 px-4 py-2
                                     rounded-full border border-white/5"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {project.tags?.length > 0 && (
              <motion.div variants={staggerItem} className="mb-10">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-violet-400/60 px-3 py-1.5
                                     rounded-full bg-violet-600/5 border border-violet-600/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Before / After slider */}
            {hasBeforeAfter && (
              <motion.div variants={staggerItem} className="mb-10">
                <h2 className="font-display text-2xl text-white uppercase mb-6">
                  Before / After
                </h2>
                <div
                  className="relative overflow-hidden rounded-2xl aspect-video
                             select-none cursor-col-resize"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setSliderPos(((e.clientX - rect.left) / rect.width) * 100);
                  }}
                >
                  {/* After (base) */}
                  <img
                    src={project.beforeAfter.after.url}
                    alt="After"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Before (clipped) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={project.beforeAfter.before.url}
                      alt="Before"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        width: `${100 / (sliderPos / 100)}%`,
                        maxWidth: "none",
                      }}
                    />
                  </div>
                  {/* Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-8 h-8 rounded-full bg-white flex items-center
                                    justify-center shadow-lg"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0a0a12"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <polyline points="15 18 9 12 15 6" />
                        <polyline
                          points="9 18 3 12 9 6"
                          style={{
                            transform: "scaleX(-1)",
                            transformOrigin: "center",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Labels */}
                  <div
                    className="absolute top-4 left-4 text-xs font-medium
                                  bg-black/50 px-2 py-1 rounded text-white"
                  >
                    Before
                  </div>
                  <div
                    className="absolute top-4 right-4 text-xs font-medium
                                  bg-black/50 px-2 py-1 rounded text-white"
                  >
                    After
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
