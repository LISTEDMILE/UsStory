import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageLoader from "../compo/Loader";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";



import { MUSIC_MAP, possibleRelationShipTypes } from "../hub/hub";

export default function CreateCreation() {
  const { creationId } = useParams(); // 👈 Detect edit mode
  const container = useRef(null);
const navigate = useNavigate();

  const audioRef = useRef(null);
  const [previewing, setPreviewing] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const isEditMode = Boolean(creationId);

  /* ================= MAIN FORM STATE ================= */
  const [form, setForm] = useState({
    recipientName: "",
    title: "",
    message: "",
    relationshipType: "friend",
    visibility: "public",
    password: "",
    musicMood: "romantic",
    visualMood: "warm",
    closingNote: "",
    accentColor: "#ffffff",
  });

  const [customRelationship, setCustomRelationship] = useState("");

  const [timeline, setTimeline] = useState([
    { title: "", description: "", date: "", images: [] },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH FOR EDIT ================= */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchCreation = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/creator/editFetch/${creationId}`,
          {
            credentials: "include", // 🔥 REQUIRED

            method: "GET",
          },
        );

        const ress = await res.json();
        const data = ress.creation;
        if (!res.ok) throw new Error("Failed to load creation");

        setForm({
          recipientName: data.recipientName || "",
          title: data.title || "",
          message: data.message || "",
          relationshipType: data.relationshipType || "friend",
          visibility: data.visibility || "public",
          password: data.password || "",
          musicMood: data.musicMood || "romantic",
          visualMood: data.visualMood || "warm",
          closingNote: data.closingNote || "",
          accentColor: data.accentColor || "#ffffff",
        });
        if (!possibleRelationShipTypes.includes(data.relationshipType)) {
          setForm((prev) => ({
            ...prev,
            relationshipType: "custom",
          }));
          setCustomRelationship(data.relationshipType);
        }

        setTimeline(
          (data.timeline || []).map((m) => ({
            title: m.title || "",
            description: m.description || "",
            date: m.date ? m.date.split("T")[0] : "",
            images: (m.images || []).map((img) => ({
              url: img.url,
              publicId: img.publicId,
              preview: img.url,
              existing: true,
            })),
          })),
        );
      } catch (err) {
        setError("Failed to load creation.");
      }
    };

    fetchCreation();
  }, [creationId, isEditMode]);

  /* ================= GSAP ================= */
  useGSAP(
    () => {
      gsap.from(".form-section", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: container },
  );

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimelineChange = (index, field, value) => {
    const updated = [...timeline];
    updated[index][field] = value;
    setTimeline(updated);
  };

  const addTimelineEntry = () => {
    setTimeline([
      ...timeline,
      { title: "", description: "", date: "", images: [] },
    ]);
  };

  const removeTimelineEntry = (index) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const handleImageAdd = async (index, files) => {
    const updated = [...timeline];

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      initialQuality: 0.5,
      useWebWorker: true,
    };

    const compressedImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const compressedFile = await imageCompression(file, options);

        return {
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
        };
      }),
    );

    updated[index].images = [...updated[index].images, ...compressedImages];

    setTimeline(updated);
  };

  const removeImage = (momentIndex, imageIndex) => {
    const updated = [...timeline];
    URL.revokeObjectURL(updated[momentIndex].images[imageIndex].preview);
    updated[momentIndex].images.splice(imageIndex, 1);
    setTimeline(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    if (audioRef.current) {
      audioRef.current.pause();
      setPreviewing(null);
    }

    try {
      const finalRelationShipType =
        form.relationshipType !== "custom"
          ? form.relationshipType
          : customRelationship;

      if (form.relationshipType === "custom" && !customRelationship.trim()) {
        setError("Please enter a custom relationship type.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "password" && form.visibility !== "private") return;
        if (key === "relationshipType") return;
        formData.append(key, value);
      });
      formData.append("relationshipType", finalRelationShipType);

      formData.append(
        "timeline",
        JSON.stringify(
          timeline.map((moment) => ({
            title: moment.title,
            description: moment.description,
            date: moment.date,
            images: moment.images
              .filter((img) => img.existing)
              .map((img) => ({
                url: img.url,
                publicId: img.publicId,
              })),
          })),
        ),
      );

      timeline.forEach((moment, momentIndex) => {
        moment.images.forEach((img) => {
          if (img.file) {
            formData.append("images", img.file);
            formData.append("imageMomentIndex", momentIndex);
          }
        });
      });

      const endpoint = isEditMode
        ? `${import.meta.env.VITE_API_URL}/creator/update/${creationId}`
        : `${import.meta.env.VITE_API_URL}/creator/create`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.errors?.[0] || "Failed");
      }

      setSuccess(
        isEditMode
          ? "Story updated successfully ✨"
          : "Story created successfully ✨",
      );
alert(isEditMode
          ? "Story updated successfully ✨"
          : "Story created successfully ✨",
      );
navigate("/creator/creations");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      ref={container}
      className="min-h-screen bg-black px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="form-section text-4xl font-bold md:text-6xl">
          {isEditMode ? "Edit" : "Create"}{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Story
          </span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-4xl space-y-12"
      >
        {/* Recipient */}
        <div className="form-section">
          <label className="mb-2 block text-sm text-neutral-400">
            Recipient Name *
          </label>
          <input
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            required
            maxLength={50}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-violet-500"
          />
        </div>

        {/* Title */}
        <div className="form-section">
          <label className="mb-2 block text-sm text-neutral-400">
            Story Title *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-violet-500"
          />
        </div>

        {/* Message */}
        <div className="form-section">
          <label className="mb-2 block text-sm text-neutral-400">
            Main Message *
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            maxLength={2000}
            rows={5}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-violet-500"
          />
        </div>

        {/* Visibility & Music */}
        <div className="form-section grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Visibility
            </label>
            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black px-5 py-4"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Password (ONLY IF PRIVATE) */}
          {form.visibility === "private" && (
            <div className="form-section relative">
              <label className="mb-2 block text-sm text-neutral-400">
                Story Password *
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 pr-14 focus:outline-none focus:border-white/30 transition"
                />

                {/* Show / Hide Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 hover:text-white transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          {/* Relationship */}
          <div className="form-section">
            <label className="mb-2 block text-sm text-neutral-400">
              Relationship Type
            </label>
            <select
              name="relationshipType"
              value={form.relationshipType}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black px-5 py-4"
            >
              <option value="friend">Friend</option>
              <option value="best-friend">Best Friend</option>
              <option value="love">Love</option>
              <option value="family">Family</option>
              <option value="mentor">Mentor</option>
              <option value="colleague">Colleague</option>
              <option value="custom">Custom</option>
            </select>

            {/* Show custom input if selected */}
            {form.relationshipType === "custom" && (
              <input
                type="text"
                name="customRelationship"
                placeholder="Enter relationship..."
                value={customRelationship}
                onChange={(e) => {
                  setCustomRelationship(e.target.value);
                }}
                required
                maxLength={30}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-violet-500"
              />
            )}
          </div>
        </div>

        {/*music */}

        <div className="form-section">
          <label className="mb-4 block text-sm text-neutral-400">
            Background Music
          </label>

          <div className="space-y-4">
            {MUSIC_MAP.map((track) => (
              <div
                key={track.id}
                className={`flex items-center justify-between rounded-xl border px-5 py-4 transition
          ${
            form.musicMood === track.id
              ? "border-violet-500 bg-white/10"
              : "border-white/10 bg-white/5"
          }`}
              >
                {/* Track Info */}
                <div>
                  <p className="font-medium">{track.name}</p>
                </div>

                {/* Controls */}
                <div className="flex gap-3 items-center">
                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!audioRef.current) return;

                      if (previewing === track.id) {
                        audioRef.current.pause();
                        setPreviewing(null);
                      } else {
                        audioRef.current.src = track.file;
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                        setPreviewing(track.id);
                      }
                    }}
                    className="text-sm px-3 py-1 rounded-full border border-white/20 hover:bg-white/10"
                  >
                    {previewing === track.id ? "Stop" : "Preview"}
                  </button>

                  {/* Select Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        musicMood: track.id,
                      }))
                    }
                    className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 text-black"
                  >
                    {form.musicMood === track.id ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <audio ref={audioRef} />
        </div>

        {/* Visual Mood */}
        <div className="form-section grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-neutral-400">Theme</label>
            <select
              name="visualMood"
              value={form.visualMood}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black px-5 py-4"
            >
              <option value="warm">Warm</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="pastel">Pastel</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Accent Color
            </label>
            <input
              type="color"
              name="accentColor"
              value={form.accentColor}
              onChange={handleChange}
              className="h-14 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
            />
          </div>
        </div>

        {/* ================= TIMELINE ================= */}
        <div className="form-section">
          <h2 className="mb-6 text-2xl font-semibold">
            Timeline <span className="text-neutral-400">(Your Journey)</span>
          </h2>

          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 flex justify-between">
                  <h3 className="font-semibold">Moment {index + 1}</h3>
                  {timeline.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimelineEntry(index)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  placeholder="Moment title"
                  value={item.title}
                  onChange={(e) =>
                    handleTimelineChange(index, "title", e.target.value)
                  }
                  className="mb-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3"
                />

                <textarea
                  placeholder="Describe this moment..."
                  value={item.description}
                  onChange={(e) =>
                    handleTimelineChange(index, "description", e.target.value)
                  }
                  rows={3}
                  className="mb-3 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3"
                />

                <input
                  type="date"
                  value={item.date}
                  onChange={(e) =>
                    handleTimelineChange(index, "date", e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-neutral-400"
                />
                {/* ===== Timeline Images ===== */}
                <div className="mt-4">
                  <label className="mb-2 block text-sm text-neutral-400">
                    Images
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageAdd(index, e.target.files)}
                    className="block w-full cursor-pointer rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-neutral-400
      file:mr-4 file:rounded-full file:border-0
      file:bg-violet-500 file:px-4 file:py-2
      file:text-black hover:file:bg-violet-400"
                  />

                  {/* Previews */}
                  {item.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
                      {item.images.map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="group relative overflow-hidden rounded-xl border border-white/10"
                        >
                          <img
                            src={img.preview}
                            alt="preview"
                            className="h-24 w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(index, imgIndex)}
                            className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1
              text-xs text-red-400 opacity-0 transition
              group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addTimelineEntry}
            className="mt-6 rounded-full border border-white/20 px-6 py-2 text-sm transition hover:bg-white/10"
          >
            + Add another moment
          </button>
        </div>

        {/* Closing Note */}
        <div className="form-section">
          <label className="mb-2 block text-sm text-neutral-400">
            Closing Note
          </label>
          <textarea
            name="closingNote"
            value={form.closingNote}
            onChange={handleChange}
            maxLength={300}
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-violet-500"
          />
        </div>

        {error && (
          <p className="form-section rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="form-section rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            {success}
          </p>
        )}

        {/* Submit */}
        <div className="form-section pt-10 text-center">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full px-14 py-4 text-lg font-semibold text-black bg-gradient-to-r from-violet-500 to-cyan-400 hover:scale-105 transition"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Story"
                : "Create Story"}
          </button>
        </div>
      </form>

      {loading && <PageLoader text={"Loading"} />}
    </div>
  );
}
