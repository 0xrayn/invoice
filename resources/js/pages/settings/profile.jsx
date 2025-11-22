import { Transition } from "@headlessui/react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { useRef, useState } from "react";

export default function Profile({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

    // Preview profile photo
    const [previewPhoto, setPreviewPhoto] = useState(auth.user.profile_photo_url || null);

    // Form data update profile
    const {
        data,
        setData,
        patch,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        profile_photo: null, // untuk file upload
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        if (data.profile_photo) {
            formData.append("profile_photo", data.profile_photo);
        }
        formData.append("_method", "patch");

        router.post(route("profile.update"), formData, {
            preserveScroll: true,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("profile_photo", file);
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    // Delete user
    const passwordInput = useRef(null);
    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing: deleteProcessing,
        reset,
        errors: deleteErrors,
        clearErrors,
    } = useForm({ password: "" });

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <AppLayout>
            <SettingsLayout>
                <div className="space-y-10">
                    {/* Profile Form */}
                    <div className="space-y-6">
                        <header>
                            <h3 className="mb-0.5 text-base font-medium">Profile Information</h3>
                            <p className="text-sm text-gray-500">
                                Update your name, email address, and profile photo
                            </p>
                        </header>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Profile Photo */}
                            <div className="form-control">
                                <label className="label" htmlFor="profile_photo">
                                    <span className="label-text">Profile Photo</span>
                                </label>
                                <input
                                    id="profile_photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="w-full file-input file-input-bordered"
                                />
                                {previewPhoto && (
                                    <img
                                        src={previewPhoto}
                                        alt="Preview"
                                        className="object-cover w-24 h-24 mt-2 rounded-full"
                                    />
                                )}
                                {errors.profile_photo && (
                                    <p className="mt-1 text-sm text-red-500">{errors.profile_photo}</p>
                                )}
                            </div>

                            {/* Name */}
                            <div className="form-control">
                                <label className="label" htmlFor="name">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="w-full input input-bordered"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-control">
                                <label className="label" htmlFor="email">
                                    <span className="label-text">Email address</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full input input-bordered"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            {/* Email Verification */}
                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-gray-500">
                                        Your email address is unverified.{" "}
                                        <Link
                                            href={route("verification.send")}
                                            method="post"
                                            as="button"
                                            className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </p>
                                    {status === "verification-link-sent" && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-primary"
                                >
                                    Save
                                </button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm font-medium text-green-600">Profile updated successfully!</p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    {/* Delete User */}
                    {auth.user.role !== "admin" && (
                        <div className="p-4 space-y-4 border border-red-200 rounded-lg bg-red-50">
                            <header>
                                <h3 className="mb-0.5 text-base font-medium text-red-600">
                                    Delete Account
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Delete your account and all of its resources
                                </p>
                            </header>

                            <div className="text-red-600">
                                <p className="font-medium">Warning</p>
                                <p className="text-sm">
                                    Please proceed with caution, this cannot be undone.
                                </p>
                            </div>

                            <button
                                className="text-white btn btn-error"
                                onClick={() => document.getElementById("delete_modal").showModal()}
                            >
                                Delete account
                            </button>

                            <dialog id="delete_modal" className="modal">
                                <div className="modal-box">
                                    <h3 className="text-lg font-bold">
                                        Are you sure you want to delete your account?
                                    </h3>
                                    <p className="py-2 text-sm">
                                        Once your account is deleted, all of its resources and data
                                        will also be permanently deleted. Please enter your password
                                        to confirm you would like to permanently delete your account.
                                    </p>

                                    <form onSubmit={deleteUser} className="space-y-4">
                                        <input
                                            id="password"
                                            type="password"
                                            ref={passwordInput}
                                            value={deleteData.password}
                                            onChange={(e) => setDeleteData("password", e.target.value)}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            className="w-full input input-bordered"
                                        />
                                        {deleteErrors.password && (
                                            <p className="text-sm text-red-500">{deleteErrors.password}</p>
                                        )}

                                        <div className="modal-action">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    document.getElementById("delete_modal").close();
                                                    closeModal();
                                                }}
                                                className="btn"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={deleteProcessing}
                                                className="text-white btn btn-error"
                                            >
                                                Delete account
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                    )}

                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
