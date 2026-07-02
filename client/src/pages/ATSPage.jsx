import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../configs/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ATSPage = () => {
  const { resumeId } = useParams();
  const { token } = useSelector(state => state.auth);

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeATS = async () => {
    if (!jobDescription.trim()) {
      return toast.error("Please paste a job description");
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/api/ai/ats-score",
        { resumeId, jobDescription },
        { headers: { Authorization: token } }
      );

      setResult(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">ATS Resume Analysis</h1>

      {/* Job Description Input */}
      <textarea
        rows={8}
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={e => setJobDescription(e.target.value)}
        className="w-full p-4 border rounded-md mb-4 focus:outline-none focus:ring"
      />

      <button
        onClick={analyzeATS}
        disabled={loading}
        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* ATS Result */}
      {result && (
        <div className="mt-8 space-y-6">
          <div className="p-4 border rounded-md">
            <p className="text-lg font-semibold">
              ATS Score:{" "}
              <span className="text-indigo-600">{result.atsScore}%</span>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Matched Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSPage;