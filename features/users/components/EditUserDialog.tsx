"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { UserDto, AdminUpdatePayload, useAdminUpdateUser } from "@/features/users/api/queries";
import { X, Pencil, Loader } from "lucide-react";

interface EditUserDialogProps {
    user: UserDto;
    onClose: () => void;
}

interface FormValues {
    role: "USER" | "LEADER" | "ADMIN";
    points: number;
}

export default function EditUserDialog({ user, onClose }: EditUserDialogProps) {
    const updateMutation = useAdminUpdateUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            role: user.role,
            points: user.points,
        },
    });

    const onSubmit = (data: FormValues) => {
        const payload: AdminUpdatePayload = {
            userId: user.id,
            role: data.role,
            points: Number(data.points),
        };
        updateMutation.mutate(payload, { onSuccess: () => onClose() });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md sm:mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Pencil className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Edytuj Użytkownika
                            </h3>
                            <p className="text-sm text-gray-500">
                                {user.firstName} {user.lastName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rola
                        </label>
                        <select
                            {...register("role")}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="USER">Użytkownik</option>
                            <option value="LEADER">Lider</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>

                    {/* Points */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Punkty
                        </label>
                        <input
                            type="number"
                            min={0}
                            {...register("points", {
                                min: { value: 0, message: "Min. 0" },
                                valueAsNumber: true,
                            })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                        {errors.points && (
                            <p className="text-xs text-red-500 mt-1">{errors.points.message}</p>
                        )}
                    </div>

                    {/* Info */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-700">
                            <strong>Uwaga:</strong> Zmiana roli na ADMIN daje pełne uprawnienia administratora.
                            Zmiana punktów bezpośrednio nadpisze aktualne saldo.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={updateMutation.isPending}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {updateMutation.isPending ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <Pencil className="w-4 h-4" />
                            )}
                            Zapisz
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
