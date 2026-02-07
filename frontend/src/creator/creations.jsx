import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiFetch } from "../api/api";
import { Link } from "react-router-dom";
import PageLoader from "../compo/Loader";

export default function Creations() {
  const { _id } = useSelector((state) => state.userInfo);
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreations = async () => {
      try {
        const res = await apiFetch("/creator/creations", {
          method: "GET",
        });

        if (res.success) {
          setCreations(res.creations);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreations();
  }, [_id]);

  const deleteCreation = async (id) => {
    const confirmDelete = window.confirm("Delete this creation?");
    if (!confirmDelete) return;

    try {
      const res = await apiFetch(`/creator/delete/${id}`, {
        method: "DELETE",
      });

      if (res.success) {
        setCreations((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyLink = (id) => {
    const link = `${window.location.origin}/viewer/creation/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24 ">
      <h1 className="text-3xl md:text-4xl font-light mb-16 tracking-wide">
        My Creations
      </h1>

      {creations.length === 0 ? (
        <div className="text-white/60">You haven’t created anything yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
          {creations.map((creation) => (
            <div
              key={creation._id}
              className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500"
            >
              {/* Title */}
              <h2 className="text-xl font-medium mb-2">{creation.title}</h2>

              {/* Recipient */}
              <p className="text-sm text-white/50 mb-6">
                For {creation.recipientName}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/creator/creation/${creation._id}`}
                  className="px-4 py-2 text-xs border border-white/20 rounded-full hover:bg-white hover:text-black transition duration-300"
                >
                  View
                </Link>

                <button
                  onClick={() => copyLink(creation._id)}
                  className="px-4 py-2 text-xs border border-white/20 rounded-full hover:bg-white hover:text-black transition duration-300"
                >
                  Copy Link
                </button>

                <Link
                  to={`/creator/create/${creation._id}`}
                  className="px-4 py-2 text-xs border border-white/20 rounded-full hover:bg-white hover:text-black transition duration-300"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteCreation(creation._id)}
                  className="px-4 py-2 text-xs border border-red-500/40 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <PageLoader text={"Loading your creations..."} />}
    </div>
  );
}
