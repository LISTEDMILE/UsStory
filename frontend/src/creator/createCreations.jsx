
// import React, { useRef, useState } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";

// export default function CreateCreation() {
//   const container = useRef(null);

//   /* ================= MAIN FORM STATE ================= */
//   const [form, setForm] = useState({
//     recipientName: "",
//     title: "",
//     message: "",
//     relationshipType: "friend",
//     visibility: "public",
//     musicMood: "romantic",
//     theme: "warm",
//     accentColor: "#8b5cf6",
//     closingNote: "",
//   });

//   /* ================= TIMELINE STATE ================= */
//   const [timeline, setTimeline] = useState([
//     { title: "", description: "", date: "", images: [] },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* ================= GSAP ================= */
//   useGSAP(
//     () => {
//       gsap.from(".form-section", {
//         y: 40,
//         opacity: 0,
//         stagger: 0.08,
//         duration: 0.8,
//         ease: "power3.out",
//       });
//     },
//     { scope: container }
//   );

//   /* ================= HANDLERS ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTimelineChange = (index, field, value) => {
//     const updated = [...timeline];
//     updated[index][field] = value;
//     setTimeline(updated);
//   };

//   const addTimelineEntry = () => {
//     setTimeline([
//       ...timeline,
//       { title: "", description: "", date: "", images: [] },
//     ]);
//   };

//   const removeTimelineEntry = (index) => {
//     setTimeline(timeline.filter((_, i) => i !== index));
//   };

//   const handleImageAdd = (index, files) => {
//     const updated = [...timeline];

//     const newImages = Array.from(files).map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));

//     updated[index].images = [...updated[index].images, ...newImages];
//     setTimeline(updated);
//   };

//   const removeImage = (momentIndex, imageIndex) => {
//     const updated = [...timeline];
//     updated[momentIndex].images.splice(imageIndex, 1);
//     setTimeline(updated);
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!form.recipientName || !form.title || !form.message) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();

//       /* ===== BASIC FIELDS ===== */
//       Object.entries(form).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       /* ===== TIMELINE METADATA ===== */
//       const timelineData = timeline.map((moment) => ({
//         title: moment.title,
//         description: moment.description,
//         date: moment.date,
//         imageCount: moment.images.length,
//       }));

//       formData.append("timeline", JSON.stringify(timelineData));

//       /* ===== TIMELINE IMAGES ===== */
//       timeline.forEach((moment, momentIndex) => {
//         moment.images.forEach((img) => {
//           formData.append("images", img.file);
//           formData.append("imageMomentIndex", momentIndex);
//         });
//       });

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/creator/create`,
//         {
//           method: "POST",
//           credentials: "include",
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.errors?.[0] || "Failed to create story");
//       }

//       setSuccess("Story created successfully ✨");

//       setForm({
//         recipientName: "",
//         title: "",
//         message: "",
//         relationshipType: "friend",
//         visibility: "public",
//         musicMood: "romantic",
//         theme: "warm",
//         accentColor: "#8b5cf6",
//         closingNote: "",
//       });

//       setTimeline([{ title: "", description: "", date: "", images: [] }]);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//     };
    
    

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CreateCreation() {
  const container = useRef(null);

  /* ================= MAIN FORM STATE ================= */
  const [form, setForm] = useState({
    recipientName: "",
    title: "",
    message: "",
    relationshipType: "friend",
    visibility: "public",
    password: "",
    musicMood: "romantic",
    theme: "warm",
    closingNote: "",
  });

  /* ================= TIMELINE STATE ================= */
  const [timeline, setTimeline] = useState([
    { title: "", description: "", date: "", images: [] },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    { scope: container }
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

  const handleImageAdd = (index, files) => {
    const updated = [...timeline];

    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    updated[index].images = [...updated[index].images, ...newImages];
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

    if (!form.recipientName || !form.title || !form.message) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.visibility === "private" && !form.password) {
      setError("Password is required for private stories.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      /* ===== BASIC FIELDS ===== */
      Object.entries(form).forEach(([key, value]) => {
        if (key === "password" && form.visibility !== "private") return;
        formData.append(key, value);
      });

      /* ===== TIMELINE METADATA ===== */
      const timelineData = timeline.map((moment) => ({
        title: moment.title,
        description: moment.description,
        date: moment.date,
        imageCount: moment.images.length,
      }));

      formData.append("timeline", JSON.stringify(timelineData));

      /* ===== TIMELINE IMAGES ===== */
      timeline.forEach((moment, momentIndex) => {
        moment.images.forEach((img) => {
          formData.append("images", img.file);
          formData.append("imageMomentIndex", momentIndex);
        });
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/creator/create`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.errors?.[0] || "Failed to create story");
      }

      setSuccess("Story created successfully ✨");

      setForm({
        recipientName: "",
        title: "",
        message: "",
        relationshipType: "friend",
        visibility: "public",
        password: "",
        musicMood: "romantic",
        theme: "warm",
        closingNote: "",
      });

      setTimeline([{ title: "", description: "", date: "", images: [] }]);
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
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="form-section text-4xl font-bold md:text-6xl">
          Create a{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Story
          </span>
        </h1>
        <p className="form-section mt-4 text-neutral-400">
          Capture memories, moments, and emotions beautifully.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-4xl space-y-12"
      >
        {/* Feedback */}
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
          <div className="form-section">
            <label className="mb-2 block text-sm text-neutral-400">
              Story Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4"
            />
          </div>
        )}

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Music Mood
            </label>
            <select
              name="musicMood"
              value={form.musicMood}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black px-5 py-4"
            >
              <option value="romantic">Romantic</option>
              <option value="happy">Happy</option>
              <option value="calm">Calm</option>
              <option value="nostalgic">Nostalgic</option>
            </select>
          </div>
        </div>

        {/* Visual Mood */}
        <div className="form-section grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-neutral-400">Theme</label>
            <select
              name="theme"
              value={form.theme}
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
            Timeline{" "}
            <span className="text-neutral-400">(Your Journey)</span>
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
    onChange={(e) =>
      handleImageAdd(index, e.target.files)
    }
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
            onClick={() =>
              removeImage(index, imgIndex)
            }
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

        {/* Submit */}
        <div className="form-section pt-10 text-center">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-full px-14 py-4 text-lg font-semibold text-black transition ${
              loading
                ? "cursor-not-allowed bg-neutral-600"
                : "bg-gradient-to-r from-violet-500 to-cyan-400 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/40"
            }`}
          >
            {loading ? "Creating..." : "Create Story"}
          </button>
        </div>
      </form>
    </div>
  );
}
