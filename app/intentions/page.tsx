"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form"; // Polecam zainstalować: npm i react-hook-form
import { 
  CreateIntentionRequest, 
  IntentionType, 
  useCreateIntention, 
  useMyIntentions, 
  IntentionStatus 
} from "@/features/intentions/api/queries";
import { Loader, Calendar, Inbox, CheckCircle, XCircle, Clock } from "lucide-react";

type FormValues = {
  content: string;
  type: IntentionType;
  isAnonymous: boolean;
  userSelectedDate: string;
};

export default function IntentionsPage() {
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  
  // Hooks
  const createMutation = useCreateIntention();
  const { data: myIntentions, isLoading: loadingHistory } = useMyIntentions();

  // Formularz
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      type: IntentionType.BOX_INTENTION,
      isAnonymous: false,
    }
  });

  const selectedType = watch("type");

  const onSubmit = (data: FormValues) => {
    createMutation.mutate({
      content: data.content,
      type: data.type,
      isAnonymous: data.isAnonymous,
      // Jeśli typ to Skrzynka, data nie jest potrzebna (backend wyliczy)
      userSelectedDate: data.type === IntentionType.MASS_INTENTION ? data.userSelectedDate : undefined
    }, {
      onSuccess: () => {
        reset();
        setActiveTab("history"); // Przełącz na historię po sukcesie
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">🙏 Skrzynka Intencji</h1>
        <p className="text-gray-600 mt-2">Złóż prośbę o modlitwę lub zamów Mszę Świętą</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "new" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Nowa intencja
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "history" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Moja historia
          </button>
        </div>
      </div>

      {/* --- TAB: NOWA INTENCJA --- */}
      {activeTab === "new" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Wybór Typu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
                selectedType === IntentionType.BOX_INTENTION 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-200"
              }`}>
                <input {...register("type")} type="radio" value={IntentionType.BOX_INTENTION} className="sr-only" />
                <Inbox className={`w-8 h-8 ${selectedType === IntentionType.BOX_INTENTION ? "text-purple-600" : "text-gray-400"}`} />
                <div className="text-center">
                  <span className="font-semibold block text-gray-900">Skrzynka Intencji</span>
                  <span className="text-xs text-gray-500">Czytana zbiorowo (Środa/Niedziela)</span>
                </div>
              </label>

              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
                selectedType === IntentionType.MASS_INTENTION 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-200"
              }`}>
                <input {...register("type")} type="radio" value={IntentionType.MASS_INTENTION} className="sr-only" />
                <Calendar className={`w-8 h-8 ${selectedType === IntentionType.MASS_INTENTION ? "text-purple-600" : "text-gray-400"}`} />
                <div className="text-center">
                  <span className="font-semibold block text-gray-900">Indywidualna Msza</span>
                  <span className="text-xs text-gray-500">Na konkretny dzień i godzinę</span>
                </div>
              </label>
            </div>

            {/* Treść */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Treść intencji</label>
              <textarea
                {...register("content", { required: "Treść jest wymagana", minLength: { value: 5, message: "Minimum 5 znaków" } })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Np. O zdrowie dla babci Janiny..."
              />
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>

            {/* Data (Tylko dla Mszy) */}
            {selectedType === IntentionType.MASS_INTENTION && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Proponowana data</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("userSelectedDate", { required: "Data jest wymagana dla Mszy" })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Ostateczna godzina zostanie potwierdzona przez opiekuna.</p>
                {errors.userSelectedDate && <p className="text-red-500 text-xs mt-1">{errors.userSelectedDate.message}</p>}
              </div>
            )}

            {/* Opcje */}
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="anon" 
                {...register("isAnonymous")}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <label htmlFor="anon" className="text-sm text-gray-700 select-none">
                Chcę pozostać anonimowy (nie czytaj nazwiska)
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? <Loader className="animate-spin w-5 h-5" /> : "Wyślij prośbę"}
            </button>
          </form>
        </div>
      )}

      {/* --- TAB: HISTORIA --- */}
      {activeTab === "history" && (
        <div className="space-y-4 animate-in fade-in">
          {loadingHistory ? (
            <div className="text-center py-12"><Loader className="animate-spin mx-auto text-purple-600" /></div>
          ) : myIntentions?.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">Brak historii intencji.</div>
          ) : (
            myIntentions?.map((intention) => (
              <div key={intention.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      intention.type === IntentionType.BOX_INTENTION ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {intention.type === IntentionType.BOX_INTENTION ? "Skrzynka" : "Msza"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(intention.targetDate).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                  <StatusBadge status={intention.status} />
                </div>
                
                <p className="text-gray-800 font-medium mb-2">{intention.content}</p>
                
                {intention.adminNote && (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mt-3 border-l-4 border-gray-300">
                    <span className="font-bold text-gray-700 block text-xs uppercase mb-1">Odpowiedź opiekuna:</span>
                    {intention.adminNote}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Helper Component: Status Badge
const StatusBadge = ({ status }: { status: IntentionStatus }) => {
  switch (status) {
    case IntentionStatus.PENDING:
      return <span className="flex items-center gap-1 text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"><Clock className="w-3 h-3" /> Oczekuje</span>;
    case IntentionStatus.APPROVED:
      return <span className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Przyjęta</span>;
    case IntentionStatus.REJECTED:
      return <span className="flex items-center gap-1 text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full"><XCircle className="w-3 h-3" /> Odrzucona</span>;
    case IntentionStatus.COMPLETED:
      return <span className="flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Omodlona</span>;
    default: return null;
  }
};