import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Phone, MapPin, Users as UsersIcon, Pencil, FileText, X,
} from "lucide-react";
import useChildrenStore from "@/store/childrenStore";
import { groupColors } from "./mockChildren";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { useTranslation } from "@/i18n/useTranslation";

export default function ChildProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const children = useChildrenStore((state) => state.children);
  const [previewImage, setPreviewImage] = useState(null);

  const child = children.find((c) => String(c.id) === id);

  if (!child) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/children")}>
          <ArrowLeft size={16} className="mr-2" />
          {t("back")}
        </Button>
        <p className="text-gray-500">{t("childProfile.notFound")}</p>
      </div>
    );
  }

  const documents = [
    { label: t("childProfile.metric"), url: child.birthCertificateUrl },
    { label: t("childProfile.fatherPassport"), url: child.fatherPassportUrl },
    { label: t("childProfile.motherPassport"), url: child.motherPassportUrl },
    { label: t("childProfile.contract"), url: child.contractUrl },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/children")}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">{t("childProfile.title")}</h1>
        </div>
        <Link to={`/children/${child.id}/edit`}>
          <Button variant="outline">
            <Pencil size={16} className="mr-2" />
            {t("common.edit")}
          </Button>
        </Link>
      </div>

      {/* Asosiy ma'lumot kartasi */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {child.photoUrl ? (
              <img
                src={child.photoUrl}
                alt={child.firstName}
                className="w-32 h-32 rounded-full object-cover cursor-pointer ring-4 ring-sky/15 shrink-0"
                onClick={() => setPreviewImage(child.photoUrl)}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-3xl text-gray-500 dark:text-gray-400 font-semibold ring-4 ring-sky/15 shrink-0">
                {child.firstName?.[0]}
                {child.lastName?.[0]}
              </div>
            )}
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-ink dark:text-gray-100">
                {child.firstName} {child.lastName}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5 flex-wrap">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    groupColors[child.group] || ""
                  }`}
                >
                  {child.group || t("childProfile.noGroup")}
                </span>
                <Badge
                  variant={child.paymentStatus === "to'langan" ? "default" : "destructive"}
                >
                  {t("paymentStatus." + child.paymentStatus) || child.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-xs text-gray-400 mb-1">{t("children.birthDate")}</p>
              <p className="font-medium">{child.birthDate || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">{t("childProfile.gender")}</p>
              <p className="font-medium capitalize">{child.gender || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <MapPin size={12} /> {t("childProfile.address")}
              </p>
              <p className="font-medium">{child.address || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ota-ona ma'lumotlari */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UsersIcon size={16} />
            {t("childProfile.parents")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">{t("childProfile.father")}</p>
            <p className="font-medium">{child.fatherName || "—"}</p>
            {child.fatherPhone && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Phone size={12} /> {child.fatherPhone}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">{t("childProfile.mother")}</p>
            <p className="font-medium">{child.motherName || "—"}</p>
            {child.motherPhone && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Phone size={12} /> {child.motherPhone}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hujjatlar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText size={16} />
            {t("childProfile.documents")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <div key={doc.label} className="border rounded-xl overflow-hidden bg-gray-50">
                {doc.url ? (
                  <img
                    src={doc.url}
                    alt={doc.label}
                    className="w-full h-28 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setPreviewImage(doc.url)}
                  />
                ) : (
                  <div className="w-full h-28 flex items-center justify-center text-gray-300">
                    <FileText size={28} />
                  </div>
                )}
                <p className="text-xs text-gray-500 text-center py-2 px-1 border-t bg-white">
                  {doc.label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rasmni kattalashtirib ko'rish oynasi */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white bg-white/10 rounded-full p-2 hover:bg-white/20"
            onClick={() => setPreviewImage(null)}
          >
            <X size={20} />
          </button>
          <img
            src={previewImage}
            alt={t("childProfile.documents")}
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}