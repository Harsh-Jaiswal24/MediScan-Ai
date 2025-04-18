import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import logo from '/logo.png';

const UserReport = () => {
  const { user, isLoaded } = useUser();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedReports, setExpandedReports] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      if (!isLoaded || !user) return;

      try {
        const res = await axios.get("https://mediscan-backend-rvc7.onrender.com/userreports", {
          params: { userId: user.id },
        });

        setReports(res.data.reports);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isLoaded, user]);

  const toggleReport = (reportId) => {
    setExpandedReports(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };


  const downloadPDF = async (rep, author, index, subIndex) => {
    const doc = new jsPDF();
    const createdDate = new Date(rep.createdAt).toLocaleString();
  
    // Convert logo to base64
    const getBase64FromImageUrl = async (url) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };
  
    const base64Logo = await getBase64FromImageUrl('/logo.png');
  
    let y = 20;
  
    const addHeader = () => {
      doc.addImage(base64Logo, 'PNG', 150, y, 15, 15);
      doc.setFontSize(18);
      doc.setTextColor(20, 184, 166);
      doc.setFont("helvetica", "bold");
      doc.text("MediScan : AI-powered health assistant", 20, y + 10);
      y += 25;
    };
  
    addHeader();
  
    // Patient Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(`Patient Name: ${author.fullName}`, 20, y);
    doc.text(`Email: ${author.email}`, 20, y + 7);
    doc.text(`Report ID: ${index + 1}.${subIndex + 1}`, 20, y + 14);
    doc.text(`Generated On: ${createdDate}`, 20, y + 21);
  
    y += 30;
  
    // Line before report
    doc.setLineWidth(0.2);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, y, 190, y);
    y += 10;
  
    // Report Content
    const reportLines = doc.splitTextToSize(rep.report, 180);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0);
  
    for (const line of reportLines) {
      if (y > 260) {
        doc.addPage();
        y = 20;
        addHeader();
  
        // Reset font after page change
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0);
      }
      doc.text(line, 20, y);
      y += 8;
    }
  
    // Line after report
    if (y > 260) {
      doc.addPage();
      y = 20;
      addHeader();
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0);
    }
  
    doc.setLineWidth(0.2);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, y, 190, y);
    y += 10;
  
    // Disclaimer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(200, 0, 0);
    doc.text(
      "Disclaimer: This report is generated by AI and should not be used as a substitute for professional medical advice.",
      20,
      y
    );
  
    y += 20;
  
    // About Section
    const pageHeight = doc.internal.pageSize.height;
    if (y > pageHeight - 50) {
      doc.addPage();
      y = 20;
      addHeader();
    }
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80);
    const about =
      "About MediScan: MediScan is your AI-powered health assistant. It helps users analyze symptoms and medical images using Gen-AI to provide potential diagnoses and suggestions.";
    const aboutWrapped = doc.splitTextToSize(about, 170);
    doc.text(aboutWrapped, 20, y);
    y += aboutWrapped.length * 8 + 10;
  
    // Footer Link
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 120, 255);
    doc.text("Visit us: ", 20, y);
    doc.setTextColor(0, 120, 255);
    doc.textWithLink("bit.ly/mediscan", 40, y, {
      url: "https://bit.ly/mediscan",
    });
  
    doc.save(`MediScan_Report_${index + 1}_${subIndex + 1}.pdf`);
  };
  



  const renderSkeleton = () => (
    <div className="space-y-4 px-4 max-w-4xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 animate-pulse h-24 rounded-lg" />
      ))}
    </div>
  );

  const markdownComponents = {
    strong: ({ children }) => (
      <span className="font-bold text-teal-600">{children}</span>
    ),
    p: ({ children }) => (
      <p className="text-gray-800 mb-2 leading-relaxed">{children}</p>
    ),
    h1: ({ children }) => (
      <h3 className="text-3xl font-semibold text-teal-700 mb-4">{children}</h3>
    ),
    h2: ({ children }) => (
      <h4 className="text-2xl font-medium text-gray-800 mt-6 mb-3">{children}</h4>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 text-gray-800 mb-5">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="mb-3">{children}</li>
    ),
  };

  if (!isLoaded || loading) return renderSkeleton();
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (reports.length === 0) return <p className="text-center mt-10 text-gray-600">No reports found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-10 text-center text-teal-600">Your Medical Reports</h2>

      <div className="space-y-10">
        {reports.map((reportDoc, index) => (
          <div key={index} className="bg-gradient-to-br from-[#f0f6ff] to-blue-50 border rounded-xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Patient: <span className="text-teal-600">{reportDoc.author.fullName}</span>
              </h3>
              <p className="text-sm text-gray-500">Email: {reportDoc.author.email}</p>
            </div>

            <div className="space-y-6 mt-4 border-t pt-4">
              {reportDoc.reports.map((rep, idx) => {
                const reportId = `${index}-${idx}`;
                const isExpanded = expandedReports[reportId];
                const previewText = rep.report.length > 150
                  ? rep.report.substring(0, 150) + "..."
                  : rep.report;

                return (
                  <div
                    key={reportId}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleReport(reportId)}>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          Generated on: {new Date(rep.createdAt).toLocaleString()}
                        </div>
                        <h4 className="font-semibold text-lg text-teal-700">
                          Report {index + 1}.{idx + 1}
                        </h4>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <div className="mt-3">
                      {isExpanded ? (
                        <div className="space-y-4">
                          <ReactMarkdown components={markdownComponents}>
                            {rep.report}
                          </ReactMarkdown>

                          <button
                            className="mt-2 flex items-center gap-2 text-sm text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded shadow"
                            onClick={() => downloadPDF(rep, reportDoc.author, index, idx)}
                          >
                            <Download className="w-4 h-4" />
                            Download Report
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">{previewText}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReport;
