import React, { useState } from "react";
import { ArrowLeft, LogOut, FileText, QrCode } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LabTest {
  batchId: string;
  labName: string;
  analystId: string;
  testDate: string;
  moisture: string;
  pesticide_ppm: { [chemical: string]: string };
  heavyMetals_ppm: { [metal: string]: string };
  ashContent: string;
  dnaBarcode: {
    matched: boolean;
    confidence: string;
    referenceId: string;
  };
  notes: string;
  result: "Pass" | "Fail" | "Conditional";
  failReasons?: string[];
  certificateUrl?: string;
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

const LabDashboard: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { logout } = useAuth();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  const emptyTest: LabTest = {
    batchId: "",
    labName: "",
    analystId: "",
    testDate: new Date().toISOString().split("T")[0],
    moisture: "",
    pesticide_ppm: {},
    heavyMetals_ppm: {},
    ashContent: "",
    dnaBarcode: { matched: true, confidence: "", referenceId: "" },
    notes: "",
    result: "Pass",
    failReasons: [],
    certificateUrl: "",
    qrCode: "",
  };

  const [formData, setFormData] = useState<LabTest>({ ...emptyTest });

  const handleInputChange = (key: keyof LabTest, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePesticideChange = (chem: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pesticide_ppm: { ...prev.pesticide_ppm, [chem]: value },
    }));
  };

  const handleHeavyMetalChange = (metal: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      heavyMetals_ppm: { ...prev.heavyMetals_ppm, [metal]: value },
    }));
  };

  const handleSubmit = () => {
    // Add createdAt/updatedAt
    const newTest = { ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTests((prev) => [...prev, newTest]);
    setFormData({ ...emptyTest });
    setSelectedTest(null);
    // Here you can call backend API to store the test
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "Pass":
        return "bg-green-100 text-green-800";
      case "Fail":
        return "bg-red-100 text-red-800";
      case "Conditional":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-600 shadow-md border-b border-green-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button onClick={onBack} className="p-2 hover:bg-green-500 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <h1 className="text-xl font-semibold text-white">Lab Dashboard</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-white hover:text-gray-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTest && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Lab Tests</h2>
              <button
                onClick={() => setSelectedTest({ ...emptyTest })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                New Test
              </button>
            </div>
            {tests.length === 0 ? (
              <p className="text-gray-600">No lab tests available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <div
                    key={test.batchId + test.testDate}
                    className="bg-green-100 p-5 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition transform hover:-translate-y-1"
                    onClick={() => setSelectedTest(test)}
                  >
                    <h3 className="font-bold text-gray-900 text-lg">{test.batchId}</h3>
                    <p className="text-sm text-gray-800">{test.labName}</p>
                    <span
                      className={`inline-flex px-3 py-1 mt-3 text-sm font-medium rounded-full ${getResultColor(
                        test.result
                      )}`}
                    >
                      {test.result}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTest && (
          <div className="bg-green-100 rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedTest.batchId ? `Edit Test - ${selectedTest.batchId}` : "New Lab Test"}
            </h2>

            {/* Batch & Lab Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Batch ID"
                value={formData.batchId}
                onChange={(e) => handleInputChange("batchId", e.target.value)}
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Lab Name"
                value={formData.labName}
                onChange={(e) => handleInputChange("labName", e.target.value)}
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Analyst ID"
                value={formData.analystId}
                onChange={(e) => handleInputChange("analystId", e.target.value)}
                className="p-2 border rounded w-full"
              />
              <input
                type="date"
                placeholder="Test Date"
                value={formData.testDate}
                onChange={(e) => handleInputChange("testDate", e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Parameters */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Moisture"
                value={formData.moisture}
                onChange={(e) => handleInputChange("moisture", e.target.value)}
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Ash Content"
                value={formData.ashContent}
                onChange={(e) => handleInputChange("ashContent", e.target.value)}
                className="p-2 border rounded w-full"
              />

              {/* Pesticides Table */}
              <div>
                <p className="font-semibold mb-2">Pesticides (ppm)</p>
                {Object.entries(formData.pesticide_ppm).map(([chem, val]) => (
                  <div key={chem} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Chemical"
                      value={chem}
                      disabled
                      className="p-2 border rounded flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={val}
                      onChange={(e) => handlePesticideChange(chem, e.target.value)}
                      className="p-2 border rounded flex-1"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handlePesticideChange(`Chemical${Date.now()}`, "")}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Add Chemical
                </button>
              </div>

              {/* Heavy Metals Table */}
              <div>
                <p className="font-semibold mb-2">Heavy Metals (ppm)</p>
                {Object.entries(formData.heavyMetals_ppm).map(([metal, val]) => (
                  <div key={metal} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Metal"
                      value={metal}
                      disabled
                      className="p-2 border rounded flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={val}
                      onChange={(e) => handleHeavyMetalChange(metal, e.target.value)}
                      className="p-2 border rounded flex-1"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleHeavyMetalChange(`Metal${Date.now()}`, "")}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Add Metal
                </button>
              </div>

              {/* DNA Barcode */}
              <div className="space-y-2">
                <p className="font-semibold">DNA Barcode</p>
                <label className="flex items-center space-x-2">
                  <span>Matched</span>
                  <input
                    type="checkbox"
                    checked={formData.dnaBarcode.matched}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dnaBarcode: { ...prev.dnaBarcode, matched: e.target.checked },
                      }))
                    }
                  />
                </label>
                <input
                  type="text"
                  placeholder="Confidence"
                  value={formData.dnaBarcode.confidence}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dnaBarcode: { ...prev.dnaBarcode, confidence: e.target.value },
                    }))
                  }
                  className="p-2 border rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Reference ID"
                  value={formData.dnaBarcode.referenceId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dnaBarcode: { ...prev.dnaBarcode, referenceId: e.target.value },
                    }))
                  }
                  className="p-2 border rounded w-full"
                />
              </div>

              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Result */}
            <div className="space-y-2">
              <label>Result:</label>
              <select
                value={formData.result}
                onChange={(e) => handleInputChange("result", e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="Pass">Pass ✅</option>
                <option value="Fail">Fail ❌</option>
                <option value="Conditional">Conditional ⚠</option>
              </select>

              {formData.result === "Fail" && (
                <textarea
                  placeholder="Fail Reasons (comma separated)"
                  value={formData.failReasons?.join(",")}
                  onChange={(e) =>
                    handleInputChange("failReasons", e.target.value.split(","))
                  }
                  className="p-2 border rounded w-full"
                />
              )}
            </div>

            {/* Certificate & QR */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Certificate URL"
                value={formData.certificateUrl}
                onChange={(e) => handleInputChange("certificateUrl", e.target.value)}
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="QR Code URL"
                value={formData.qrCode}
                onChange={(e) => handleInputChange("qrCode", e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setSelectedTest(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LabDashboard;
