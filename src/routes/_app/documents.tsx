import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useRef, useState } from "react";
import { api } from "convex/_generated/api";
import type { FormEvent } from "react";
import type { Id } from 'convex/_generated/dataModel'
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_app/documents")({
    component: RouteComponent,
});

function RouteComponent() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const documents = useQuery(api.documents.listDocuments);
    const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
    const saveDocument = useMutation(api.documents.saveDocument);
    // const getDocumentUrl = useQuery(api.documents.getDocumentUrl, { fileId:  });
    const deleteDocument = useMutation(api.documents.deleteDocument);

    // Upload Handler
    async function handleUpload(e: FormEvent) {
        e.preventDefault();
        if (!selectedFile) return;

        // 1️⃣ Generate an upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // 2️⃣ Upload file directly to Convex Storage
        const res = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": selectedFile.type },
            body: selectedFile,
        });
        const { storageId } = await res.json();

        // 3️⃣ Save metadata to Convex DB
        await saveDocument({
            name: selectedFile.name,
            fileId: storageId,
        });

        // Reset file input
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
    // Delete Handler
    async function handleDelete(id: string, fileId: string | Id<"_storage">) {
        if (!confirm("Are you sure you want to delete this document?")) return;
        await deleteDocument({ id: (id as unknown) as Id<"documents">, fileId: (fileId as unknown) as Id<"_storage"> });
    }

    return (
        <div className="container  ">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Documents</h1>
                <form onSubmit={handleUpload} className="flex gap-3 items-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    />
                    <Button type="submit" isDisabled={!selectedFile}>
                        Upload
                    </Button>
                </form>
            </div>




            {/* List Documents */}
            <div className="space-y-2 flex flex-col gap-2 mt-4">
                {!documents?.length && (
                    <div className="text-muted-foreground">
                        No documents uploaded yet.
                    </div>
                )}

                {documents?.map((doc) => (
                    <div
                        key={doc._id}
                        className="flex justify-between items-center border rounded-md p-3"
                    >
                        <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(doc.createdAt).toLocaleString()}
                            </p>
                            {doc.url && (
                                <img
                                    src={doc.url}
                                    alt={doc.name}
                                    className="max-w-full max-h-40 object-contain rounded"
                                />
                            )}
                        </div>
                        <div className="flex gap-2">

                            <Button
                                type="button"
                                intent="danger"
                                size="sm"
                                onClick={() => handleDelete(doc._id, doc.fileId)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
