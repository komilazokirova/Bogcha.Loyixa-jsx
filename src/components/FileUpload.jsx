import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";

export default function FileUpload({ label, onChange, error }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    onChange(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName("");
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink dark:text-gray-100">
        {label}
      </label>

      {!fileName ? (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Upload size={20} className="text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Fayl tanlash uchun bosing
          </span>
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <FileText size={20} className="text-gray-400 dark:text-gray-500" />
            )}
            <span className="text-sm truncate text-ink dark:text-gray-100">
              {fileName}
            </span>
          </div>
          <button type="button" onClick={handleRemove}>
            <X size={16} className="text-red-500" />
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}