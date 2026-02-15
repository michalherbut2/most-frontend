"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
    DutyCategory,
    CreateSlotPayload,
    useCreateDutySlot,
} from "@/features/duties/api/queries";
import { X, Plus, Loader } from "lucide-react";

interface CreateDutySlotDialogProps {
    defaultCategory?: DutyCategory;
    onClose: () => void;
}

interface FormValues {
    title: string;
    date: string;
    time: string;
    category: DutyCategory;
    capacity: number;
    pointsValue: number;
    autoApproved: boolean;
}

export default function CreateDutySlotDialog({
    defaultCategory = "OTHER",
    onClose,
}: CreateDutySlotDialogProps) {
    const createMutation = useCreateDutySlot();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            title: "",
            date: "",
            time: "18:00",
            category: defaultCategory,
            capacity: 1,
            pointsValue: 0,
            autoApproved: false,
        },
    });

    const onSubmit = (data: FormValues) => {
        const payload: CreateSlotPayload = {
            ...data,
            capacity: Number(data.capacity),
            pointsValue: Number(data.pointsValue),
        };
        createMutation.mutate(payload, { onSuccess: () => onClose() });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Dodaj Slot
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tytuł
                        </label>
                        <input
                            {...register("title", { required: "Tytuł jest wymagany" })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            placeholder="np. Czytanie 1"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Date + Time row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Data
                            </label>
                            <input
                                type="date"
                                {...register("date", { required: "Data jest wymagana" })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                            {errors.date && (
                                <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Godzina
                            </label>
                            <input
                                type="time"
                                {...register("time", { required: "Godzina jest wymagana" })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                            {errors.time && (
                                <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kategoria
                        </label>
                        <select
                            {...register("category")}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="LITURGY">Liturgia</option>
                            <option value="KITCHEN">Kuchnia</option>
                            <option value="OTHER">Inne</option>
                        </select>
                    </div>

                    {/* Capacity + Points row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Limit miejsc
                            </label>
                            <input
                                type="number"
                                min={1}
                                {...register("capacity", {
                                    required: "Wymagane",
                                    min: { value: 1, message: "Min. 1" },
                                    valueAsNumber: true,
                                })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                            {errors.capacity && (
                                <p className="text-xs text-red-500 mt-1">{errors.capacity.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Punkty
                            </label>
                            <input
                                type="number"
                                min={0}
                                {...register("pointsValue", {
                                    min: { value: 0, message: "Min. 0" },
                                    valueAsNumber: true,
                                })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                            {errors.pointsValue && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.pointsValue.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Auto-approved checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            {...register("autoApproved")}
                            className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">
                            Automatyczne zatwierdzanie zgłoszeń
                        </span>
                    </label>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={createMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {createMutation.isPending ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            Dodaj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
