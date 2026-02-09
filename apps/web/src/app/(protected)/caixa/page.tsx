"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Wallet, ArrowUpRight, ArrowDownRight, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client, orpc } from "@/utils/orpc";
import { toast } from "sonner";

const paymentLabels: Record<string, string> = {
    dinheiro: "Dinheiro",
    cartao: "Cartão",
    debito: "Débito",
    pix: "PIX",
    boleto: "Boleto",
};

const statusLabels: Record<string, string> = {
    pendente: "Pendente",
    pago: "Pago",
    cancelado: "Cancelado",
};

const fulfillmentLabels: Record<string, string> = {
    entrega: "Entrega",
    retirada: "Retirada",
};


const exitCategoryLabels: Record<string, string> = {
    materia: "Matéria-prima",
    energia: "Energia",
    agua: "Água",
    gas: "Gás",
    aluguel: "Aluguel",
    outros: "Outros",
};

export default function Caixa() {
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [isExitEditModalOpen, setIsExitEditModalOpen] = useState(false);
    const [editingExitId, setEditingExitId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSource, setEditingSource] = useState<"instadelivery" | "ifood" | "manual" | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [pendingDelete, setPendingDelete] = useState<
        | {
              type: "entry";
              id: string;
              source: "instadelivery" | "ifood" | "manual";
              label: string;
          }
        | {
              type: "exit";
              id: string;
              label: string;
          }
        | null
    >(null);
    const queryClient = useQueryClient();
    const today = new Date().toISOString().slice(0, 10);
    const [instaItems, setInstaItems] = useState([{ productId: "", quantity: "1" }]);
    const [ifoodItems, setIfoodItems] = useState([{ productId: "", quantity: "1" }]);
    const [manualItems, setManualItems] = useState([{ productId: "", quantity: "1" }]);
    const [instaForm, setInstaForm] = useState({
        date: today,
        customerName: "",
        whatsapp: "",
        fulfillmentType: "",
        deliveryFee: "",
        paymentMethod: "",
        amountPaid: "",
        status: "pago",
        notes: "",
    });
    const [ifoodForm, setIfoodForm] = useState({
        date: today,
        customerName: "",
        whatsapp: "",
        fulfillmentType: "",
        deliveryFee: "",
        paymentMethod: "",
        amountPaid: "",
        status: "pago",
        notes: "",
    });
    const [manualForm, setManualForm] = useState({
        date: today,
        customerName: "",
        whatsapp: "",
        fulfillmentType: "",
        deliveryFee: "",
        paymentMethod: "",
        amountPaid: "",
        status: "pago",
        notes: "",
    });
    const [exitForm, setExitForm] = useState({
        date: today,
        category: "",
        description: "",
        amount: "",
        paymentMethod: "",
        responsible: "",
    });
    const [exitEditForm, setExitEditForm] = useState({
        date: today,
        category: "",
        description: "",
        amount: "",
        paymentMethod: "",
        responsible: "",
    });
    const [editForm, setEditForm] = useState({
        date: today,
        customerName: "",
        whatsapp: "",
        fulfillmentType: "",
        deliveryFee: "",
        paymentMethod: "",
        amountPaid: "",
        status: "pago",
        notes: "",
    });
    const [editItems, setEditItems] = useState([{ productId: "", quantity: "1" }]);
    const { data: products, isLoading: isLoadingProducts } = useQuery(
        orpc.products.list.queryOptions({})
    );
    const { data: instadeliveryEntries, isLoading: isLoadingInstadeliveryEntries } = useQuery(
        orpc.instadeliveryEntries.list.queryOptions({})
    );
    const { data: ifoodEntries, isLoading: isLoadingIfoodEntries } = useQuery(
        orpc.ifoodEntries.list.queryOptions({})
    );
    const { data: manualEntries, isLoading: isLoadingManualEntries } = useQuery(
        orpc.manualEntries.list.queryOptions({})
    );
    const { data: exits, isLoading: isLoadingExits } = useQuery(
        orpc.exits.list.queryOptions({})
    );
    const productsList = products ?? [];
    const hasProducts = productsList.length > 0;
    const combinedEntries = [
        ...(instadeliveryEntries ?? []).map((entry) => ({
            ...entry,
            source: "instadelivery" as const,
        })),
        ...(ifoodEntries ?? []).map((entry) => ({
            ...entry,
            source: "ifood" as const,
        })),
        ...(manualEntries ?? []).map((entry) => ({
            ...entry,
            source: "manual" as const,
        })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const isEntriesLoading =
        isLoadingInstadeliveryEntries || isLoadingIfoodEntries || isLoadingManualEntries;
    const totalEntries = combinedEntries.reduce((sum, entry) => sum + entry.amountPaid, 0);
    const exitsList = exits ?? [];
    const totalExits = exitsList.reduce((sum, exit) => sum + exit.amount, 0);
    const balance = totalEntries - totalExits;

    const createInstadeliveryEntry = useMutation({
        mutationFn: async (payload: {
            date: string;
            customerName: string;
            whatsapp: string;
            fulfillmentType: "entrega" | "retirada";
            deliveryFee: number;
            paymentMethod: "dinheiro" | "cartao" | "debito" | "pix" | "boleto";
            amountPaid: number;
            status: "pendente" | "pago" | "cancelado";
            notes?: string;
            items: { productId: string; quantity: number }[];
        }) => client.instadeliveryEntries.create(payload),
        onSuccess: () => {
            toast.success("Entrada InstaDelivery salva!");
            queryClient.invalidateQueries({
                queryKey: orpc.instadeliveryEntries.list.queryKey(),
            });
            setIsEntryModalOpen(false);
            setInstaForm({
                date: today,
                customerName: "",
                whatsapp: "",
                fulfillmentType: "",
                deliveryFee: "",
                paymentMethod: "",
                amountPaid: "",
                status: "pago",
                notes: "",
            });
            setInstaItems([{ productId: "", quantity: "1" }]);
        },
        onError: (error) => {
            toast.error(`Erro ao salvar entrada InstaDelivery: ${error.message}`);
        },
    });

    const createIfoodEntry = useMutation({
        mutationFn: async (payload: {
            date: string;
            customerName: string;
            whatsapp: string;
            fulfillmentType: "entrega" | "retirada";
            deliveryFee: number;
            paymentMethod: "dinheiro" | "cartao" | "debito" | "pix" | "boleto";
            amountPaid: number;
            status: "pendente" | "pago" | "cancelado";
            notes?: string;
            items: { productId: string; quantity: number }[];
        }) => client.ifoodEntries.create(payload),
        onSuccess: () => {
            toast.success("Entrada Ifood salva!");
            queryClient.invalidateQueries({
                queryKey: orpc.ifoodEntries.list.queryKey(),
            });
            setIsEntryModalOpen(false);
            setIfoodForm({
                date: today,
                customerName: "",
                whatsapp: "",
                fulfillmentType: "",
                deliveryFee: "",
                paymentMethod: "",
                amountPaid: "",
                status: "pago",
                notes: "",
            });
            setIfoodItems([{ productId: "", quantity: "1" }]);
        },
        onError: (error) => {
            toast.error(`Erro ao salvar entrada Ifood: ${error.message}`);
        },
    });

    const createManualEntry = useMutation({
        mutationFn: async (payload: {
            date: string;
            customerName: string;
            whatsapp: string;
            fulfillmentType: "entrega" | "retirada";
            deliveryFee: number;
            paymentMethod: "dinheiro" | "cartao" | "debito" | "pix" | "boleto";
            amountPaid: number;
            status: "pendente" | "pago" | "cancelado";
            notes?: string;
            items: { productId: string; quantity: number }[];
        }) => client.manualEntries.create(payload),
        onSuccess: () => {
            toast.success("Entrada Manual salva!");
            queryClient.invalidateQueries({
                queryKey: orpc.manualEntries.list.queryKey(),
            });
            setIsEntryModalOpen(false);
            setManualForm({
                date: today,
                customerName: "",
                whatsapp: "",
                fulfillmentType: "",
                deliveryFee: "",
                paymentMethod: "",
                amountPaid: "",
                status: "pago",
                notes: "",
            });
            setManualItems([{ productId: "", quantity: "1" }]);
        },
        onError: (error) => {
            toast.error(`Erro ao salvar entrada Manual: ${error.message}`);
        },
    });

    const updateInstadeliveryEntry = useMutation({
        mutationFn: async (payload: {
            id: string;
            date: string;
            customerName: string;
            whatsapp: string;
            fulfillmentType: "entrega" | "retirada";
            deliveryFee: number;
            paymentMethod: "dinheiro" | "cartao" | "debito" | "pix" | "boleto";
            amountPaid: number;
            status: "pendente" | "pago" | "cancelado";
            notes?: string;
            items: { productId: string; quantity: number }[];
        }) => client.instadeliveryEntries.update(payload),
        onSuccess: () => {
            toast.success("Entrada InstaDelivery atualizada!");
            queryClient.invalidateQueries({
                queryKey: orpc.instadeliveryEntries.list.queryKey(),
            });
            setIsEditModalOpen(false);
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar entrada InstaDelivery: ${error.message}`);
        },
    });

    const updateIfoodEntry = useMutation({
        mutationFn: async (payload: {
            id: string;
            date: string;
            customerName: string;
            whatsapp: string;
            fulfillmentType: "entrega" | "retirada";
            deliveryFee: number;
            paymentMethod: "dinheiro" | "cartao" | "debito" | "pix" | "boleto";
            amountPaid: number;
            status: "pendente" | "pago" | "cancelado";
            notes?: string;
            items: { productId: string; quantity: number }[];
        }) => client.ifoodEntries.update(payload),
        onSuccess: () => {
            toast.success("Entrada Ifood atualizada!");
            queryClient.invalidateQueries({
                queryKey: orpc.ifoodEntries.list.queryKey(),
            });
            setIsEditModalOpen(false);
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar entrada Ifood: ${error.message}`);
        },
    });

    const updateManualEntry = useMutation({
        mutationFn: async (payload: {
            id: string;
            date: string;
            customerName: string;
            whatsapp: string;
            fulfillmentType: "entrega" | "retirada";
            deliveryFee: number;
            paymentMethod: "dinheiro" | "cartao" | "debito" | "pix" | "boleto";
            amountPaid: number;
            status: "pendente" | "pago" | "cancelado";
            notes?: string;
            items: { productId: string; quantity: number }[];
        }) => client.manualEntries.update(payload),
        onSuccess: () => {
            toast.success("Entrada Manual atualizada!");
            queryClient.invalidateQueries({
                queryKey: orpc.manualEntries.list.queryKey(),
            });
            setIsEditModalOpen(false);
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar entrada Manual: ${error.message}`);
        },
    });

    const createExit = useMutation({
        mutationFn: async (payload: {
            date: string;
            category: "materia" | "energia" | "agua" | "gas" | "aluguel" | "outros";
            description: string;
            amount: number;
            paymentMethod: "dinheiro" | "cartao" | "debito" | "pix" | "boleto";
            responsible: string;
        }) => client.exits.create(payload),
        onSuccess: () => {
            toast.success("Saida registrada!");
            queryClient.invalidateQueries({
                queryKey: orpc.exits.list.queryKey(),
            });
            setIsExitModalOpen(false);
            setExitForm({
                date: today,
                category: "",
                description: "",
                amount: "",
                paymentMethod: "",
                responsible: "",
            });
        },
        onError: (error) => {
            toast.error(`Erro ao registrar saida: ${error.message}`);
        },
    });

    const updateExit = useMutation({
        mutationFn: async (payload: {
            id: string;
            date: string;
            category: "materia" | "energia" | "agua" | "gas" | "aluguel" | "outros";
            description: string;
            amount: number;
            paymentMethod: "dinheiro" | "cartao" | "debito" | "pix" | "boleto";
            responsible: string;
        }) => client.exits.update(payload),
        onSuccess: () => {
            toast.success("Saida atualizada!");
            queryClient.invalidateQueries({
                queryKey: orpc.exits.list.queryKey(),
            });
            setIsExitEditModalOpen(false);
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar saida: ${error.message}`);
        },
    });

    const deleteInstadeliveryEntry = useMutation({
        mutationFn: async (id: string) => client.instadeliveryEntries.delete({ id }),
        onSuccess: () => {
            toast.success("Entrada InstaDelivery removida!");
            queryClient.invalidateQueries({
                queryKey: orpc.instadeliveryEntries.list.queryKey(),
            });
            setPendingDelete(null);
        },
        onError: (error) => {
            toast.error(`Erro ao remover entrada InstaDelivery: ${error.message}`);
        },
    });

    const deleteIfoodEntry = useMutation({
        mutationFn: async (id: string) => client.ifoodEntries.delete({ id }),
        onSuccess: () => {
            toast.success("Entrada Ifood removida!");
            queryClient.invalidateQueries({
                queryKey: orpc.ifoodEntries.list.queryKey(),
            });
            setPendingDelete(null);
        },
        onError: (error) => {
            toast.error(`Erro ao remover entrada Ifood: ${error.message}`);
        },
    });

    const deleteManualEntry = useMutation({
        mutationFn: async (id: string) => client.manualEntries.delete({ id }),
        onSuccess: () => {
            toast.success("Entrada Manual removida!");
            queryClient.invalidateQueries({
                queryKey: orpc.manualEntries.list.queryKey(),
            });
            setPendingDelete(null);
        },
        onError: (error) => {
            toast.error(`Erro ao remover entrada Manual: ${error.message}`);
        },
    });

    const deleteExit = useMutation({
        mutationFn: async (id: string) => client.exits.delete({ id }),
        onSuccess: () => {
            toast.success("Saida removida!");
            queryClient.invalidateQueries({
                queryKey: orpc.exits.list.queryKey(),
            });
            setPendingDelete(null);
        },
        onError: (error) => {
            toast.error(`Erro ao remover saida: ${error.message}`);
        },
    });

    const buildItemsPayload = (items: { productId: string; quantity: string }[]) =>
        items
            .map((item) => ({
                productId: item.productId,
                quantity: Number(item.quantity),
            }))
            .filter((item) => item.productId && item.quantity > 0);

    const validateItems = (items: { productId: string; quantity: string }[]) => {
        if (items.length === 0) {
            toast.error("Adicione pelo menos um produto.");
            return false;
        }

        const hasInvalidItem = items.some(
            (item) => !item.productId || Number(item.quantity) <= 0
        );

        if (hasInvalidItem) {
            toast.error("Preencha produto e quantidade em todos os itens.");
            return false;
        }

        return true;
    };

    const handleSaveInstadelivery = () => {
        if (!validateItems(instaItems)) {
            return;
        }

        createInstadeliveryEntry.mutate({
            date: instaForm.date,
            customerName: instaForm.customerName.trim(),
            whatsapp: instaForm.whatsapp.trim(),
            fulfillmentType: instaForm.fulfillmentType as "entrega" | "retirada",
            deliveryFee: Number(instaForm.deliveryFee) || 0,
            paymentMethod: instaForm.paymentMethod as
                | "dinheiro"
                | "cartao"
                | "debito"
                | "pix"
                | "boleto",
            amountPaid: Number(instaForm.amountPaid) || 0,
            status: instaForm.status as "pendente" | "pago" | "cancelado",
            notes: instaForm.notes.trim() ? instaForm.notes.trim() : undefined,
            items: buildItemsPayload(instaItems),
        });
    };

    const handleSaveIfood = () => {
        if (!validateItems(ifoodItems)) {
            return;
        }

        createIfoodEntry.mutate({
            date: ifoodForm.date,
            customerName: ifoodForm.customerName.trim(),
            whatsapp: ifoodForm.whatsapp.trim(),
            fulfillmentType: ifoodForm.fulfillmentType as "entrega" | "retirada",
            deliveryFee: Number(ifoodForm.deliveryFee) || 0,
            paymentMethod: ifoodForm.paymentMethod as
                | "dinheiro"
                | "cartao"
                | "debito"
                | "pix"
                | "boleto",
            amountPaid: Number(ifoodForm.amountPaid) || 0,
            status: ifoodForm.status as "pendente" | "pago" | "cancelado",
            notes: ifoodForm.notes.trim() ? ifoodForm.notes.trim() : undefined,
            items: buildItemsPayload(ifoodItems),
        });
    };

    const handleSaveManual = () => {
        if (!validateItems(manualItems)) {
            return;
        }

        createManualEntry.mutate({
            date: manualForm.date,
            customerName: manualForm.customerName.trim(),
            whatsapp: manualForm.whatsapp.trim(),
            fulfillmentType: manualForm.fulfillmentType as "entrega" | "retirada",
            deliveryFee: Number(manualForm.deliveryFee) || 0,
            paymentMethod: manualForm.paymentMethod as
                | "dinheiro"
                | "cartao"
                | "debito"
                | "pix"
                | "boleto",
            amountPaid: Number(manualForm.amountPaid) || 0,
            status: manualForm.status as "pendente" | "pago" | "cancelado",
            notes: manualForm.notes.trim() ? manualForm.notes.trim() : undefined,
            items: buildItemsPayload(manualItems),
        });
    };

    const handleSaveExit = () => {
        if (!exitForm.category || !exitForm.paymentMethod) {
            toast.error("Selecione categoria e forma de pagamento.");
            return;
        }

        if (!exitForm.description.trim() || !exitForm.responsible.trim()) {
            toast.error("Preencha descricao e responsavel.");
            return;
        }

        createExit.mutate({
            date: exitForm.date,
            category: exitForm.category as
                | "materia"
                | "energia"
                | "agua"
                | "gas"
                | "aluguel"
                | "outros",
            description: exitForm.description.trim(),
            amount: Number(exitForm.amount) || 0,
            paymentMethod: exitForm.paymentMethod as
                | "dinheiro"
                | "cartao"
                | "debito"
                | "pix"
                | "boleto",
            responsible: exitForm.responsible.trim(),
        });
    };

    const openExitEditModal = (exit: {
        id: string;
        date: string;
        category: string;
        description: string;
        amount: number;
        paymentMethod: string;
        responsible: string;
    }) => {
        setEditingExitId(exit.id);
        setExitEditForm({
            date: exit.date.slice(0, 10),
            category: exit.category,
            description: exit.description,
            amount: String(exit.amount ?? ""),
            paymentMethod: exit.paymentMethod,
            responsible: exit.responsible,
        });
        setIsExitEditModalOpen(true);
    };

    const handleSaveExitEdit = () => {
        if (!editingExitId) {
            return;
        }

        if (!exitEditForm.category || !exitEditForm.paymentMethod) {
            toast.error("Selecione categoria e forma de pagamento.");
            return;
        }

        if (!exitEditForm.description.trim() || !exitEditForm.responsible.trim()) {
            toast.error("Preencha descricao e responsavel.");
            return;
        }

        updateExit.mutate({
            id: editingExitId,
            date: exitEditForm.date,
            category: exitEditForm.category as
                | "materia"
                | "energia"
                | "agua"
                | "gas"
                | "aluguel"
                | "outros",
            description: exitEditForm.description.trim(),
            amount: Number(exitEditForm.amount) || 0,
            paymentMethod: exitEditForm.paymentMethod as
                | "dinheiro"
                | "cartao"
                | "debito"
                | "pix"
                | "boleto",
            responsible: exitEditForm.responsible.trim(),
        });
    };

    const openEditModal = (entry: {
        id: string;
        source: "instadelivery" | "ifood" | "manual";
        date: string;
        customerName: string;
        whatsapp: string;
        fulfillmentType: string;
        deliveryFee: number;
        paymentMethod: string;
        amountPaid: number;
        status: string;
        notes: string | null;
        items: { productId: string; quantity: number }[];
    }) => {
        setEditingSource(entry.source);
        setEditingId(entry.id);
        setEditForm({
            date: entry.date.slice(0, 10),
            customerName: entry.customerName,
            whatsapp: entry.whatsapp,
            fulfillmentType: entry.fulfillmentType,
            deliveryFee: String(entry.deliveryFee ?? ""),
            paymentMethod: entry.paymentMethod,
            amountPaid: String(entry.amountPaid ?? ""),
            status: entry.status,
            notes: entry.notes ?? "",
        });
        setEditItems(
            entry.items.map((item) => ({
                productId: item.productId,
                quantity: String(item.quantity),
            }))
        );
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editingSource || !editingId) {
            return;
        }

        if (!validateItems(editItems)) {
            return;
        }

        const payload = {
            id: editingId,
            date: editForm.date,
            customerName: editForm.customerName.trim(),
            whatsapp: editForm.whatsapp.trim(),
            fulfillmentType: editForm.fulfillmentType as "entrega" | "retirada",
            deliveryFee: Number(editForm.deliveryFee) || 0,
            paymentMethod: editForm.paymentMethod as
                | "dinheiro"
                | "cartao"
                | "debito"
                | "pix"
                | "boleto",
            amountPaid: Number(editForm.amountPaid) || 0,
            status: editForm.status as "pendente" | "pago" | "cancelado",
            notes: editForm.notes.trim() ? editForm.notes.trim() : undefined,
            items: buildItemsPayload(editItems),
        };

        if (editingSource === "instadelivery") {
            updateInstadeliveryEntry.mutate(payload);
            return;
        }

        if (editingSource === "ifood") {
            updateIfoodEntry.mutate(payload);
            return;
        }

        updateManualEntry.mutate(payload);
    };

    const requestDeleteEntry = (entry: {
        id: string;
        source: "instadelivery" | "ifood" | "manual";
        customerName: string;
        date: string;
    }) => {
        const formattedDate = format(new Date(entry.date), "dd/MM/yyyy");
        setPendingDelete({
            type: "entry",
            id: entry.id,
            source: entry.source,
            label: `${entry.customerName} • ${formattedDate}`,
        });
    };

    const requestDeleteExit = (exit: { id: string; description: string; date: string }) => {
        const formattedDate = format(new Date(exit.date), "dd/MM/yyyy");
        setPendingDelete({
            type: "exit",
            id: exit.id,
            label: `${exit.description} • ${formattedDate}`,
        });
    };

    const handleConfirmDelete = () => {
        if (!pendingDelete) {
            return;
        }

        if (pendingDelete.type === "exit") {
            deleteExit.mutate(pendingDelete.id);
            return;
        }

        if (pendingDelete.source === "instadelivery") {
            deleteInstadeliveryEntry.mutate(pendingDelete.id);
            return;
        }

        if (pendingDelete.source === "ifood") {
            deleteIfoodEntry.mutate(pendingDelete.id);
            return;
        }

        deleteManualEntry.mutate(pendingDelete.id);
    };

    const renderOrderItems = (
        items: { productId: string; quantity: string }[],
        setItems: Dispatch<SetStateAction<{ productId: string; quantity: string }[]>>
    ) => (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={`item-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3">
                    <div>
                        <Label>Produto</Label>
                        <Select
                            value={item.productId}
                            onValueChange={(value) =>
                                setItems((prev) =>
                                    prev.map((entry, entryIndex) =>
                                        entryIndex === index ? { ...entry, productId: value ?? "" } : entry
                                    )
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        isLoadingProducts
                                            ? "Carregando produtos..."
                                            : "Selecione um produto"
                                    }
                                >
                                    {(value: string) => {
                                        if (!value) {
                                            return isLoadingProducts
                                                ? "Carregando produtos..."
                                                : "Selecione um produto";
                                        }

                                        const matchedProduct = productsList.find(
                                            (product) => product.id === value
                                        );

                                        return matchedProduct?.name ?? String(value);
                                    }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingProducts ? (
                                    <SelectItem value="__loading" disabled>
                                        Carregando produtos...
                                    </SelectItem>
                                ) : hasProducts ? (
                                    productsList.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="__empty" disabled>
                                        sem dados cadastrados
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Quantidade</Label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="0"
                            value={item.quantity}
                            onChange={(event) =>
                                setItems((prev) =>
                                    prev.map((entry, entryIndex) =>
                                        entryIndex === index
                                            ? { ...entry, quantity: event.target.value }
                                            : entry
                                    )
                                )
                            }
                        />
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 w-fit"
                onClick={() => setItems((prev) => [...prev, { productId: "", quantity: "1" }])}
            >
                <Plus className="h-4 w-4" />
                Adicionar produto
            </Button>
        </div>
    );

    const isEditSaving =
        updateInstadeliveryEntry.isPending ||
        updateIfoodEntry.isPending ||
        updateManualEntry.isPending;

    const isDeleting =
        deleteInstadeliveryEntry.isPending ||
        deleteIfoodEntry.isPending ||
        deleteManualEntry.isPending ||
        deleteExit.isPending;

    const deleteMessage =
        pendingDelete?.type === "entry"
            ? `Tem certeza que deseja excluir a entrada ${pendingDelete.label}?`
            : pendingDelete?.type === "exit"
              ? `Tem certeza que deseja excluir a saída ${pendingDelete.label}?`
              : "Tem certeza que deseja excluir este registro?";

    return (
        <div className="space-y-6">
            <Dialog
                open={Boolean(pendingDelete)}
                onOpenChange={(open) => {
                    if (!open) {
                        setPendingDelete(null);
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>{deleteMessage}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPendingDelete(null)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Editar Entrada
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Data</Label>
                            <Input
                                type="date"
                                value={editForm.date}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        date: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Nome do Cliente</Label>
                            <Input
                                placeholder="Nome completo"
                                value={editForm.customerName}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        customerName: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>WhatsApp</Label>
                            <Input
                                placeholder="(00) 00000-0000"
                                value={editForm.whatsapp}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        whatsapp: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Entrega/Retirada</Label>
                            <Select
                                value={editForm.fulfillmentType}
                                onValueChange={(value) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        fulfillmentType: value ?? "",
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="entrega">Entrega</SelectItem>
                                    <SelectItem value="retirada">Retirada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Taxa de Entrega</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="R$ 0,00"
                                value={editForm.deliveryFee}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        deliveryFee: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Forma de Pagamento</Label>
                            <Select
                                value={editForm.paymentMethod}
                                onValueChange={(value) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        paymentMethod: value ?? "",
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione">
                                        {(value: string) =>
                                            paymentLabels[String(value)] ?? "Selecione"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                    <SelectItem value="cartao">Cartão</SelectItem>
                                    <SelectItem value="debito">Débito</SelectItem>
                                    <SelectItem value="pix">PIX</SelectItem>
                                    <SelectItem value="boleto">Boleto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Valor Pago</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="R$ 0,00"
                                value={editForm.amountPaid}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        amountPaid: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={editForm.status}
                                onValueChange={(value) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        status: value ?? "pago",
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione">
                                        {(value: string) =>
                                            statusLabels[String(value)] ?? "Selecione"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="pago">Pago</SelectItem>
                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Label>Itens do Pedido</Label>
                            <div className="mt-2">
                                {renderOrderItems(editItems, setEditItems)}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <Label>Observacao</Label>
                            <Textarea
                                placeholder="Observacao adicional"
                                rows={2}
                                value={editForm.notes}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        notes: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            size="lg"
                            className="gap-2"
                            onClick={handleSaveEdit}
                            disabled={isEditSaving}
                        >
                            <ArrowUpRight className="h-4 w-4" />
                            {isEditSaving ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isExitEditModalOpen} onOpenChange={setIsExitEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Editar Saída
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label>Data</Label>
                            <Input
                                type="date"
                                value={exitEditForm.date}
                                onChange={(event) =>
                                    setExitEditForm((prev) => ({
                                        ...prev,
                                        date: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Categoria</Label>
                            <Select
                                value={exitEditForm.category}
                                onValueChange={(value) =>
                                    setExitEditForm((prev) => ({
                                        ...prev,
                                        category: value ?? "",
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione">
                                        {(value: string) =>
                                            exitCategoryLabels[String(value)] ?? "Selecione"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="materia">Matéria-prima</SelectItem>
                                    <SelectItem value="energia">Energia</SelectItem>
                                    <SelectItem value="agua">Água</SelectItem>
                                    <SelectItem value="gas">Gás</SelectItem>
                                    <SelectItem value="aluguel">Aluguel</SelectItem>
                                    <SelectItem value="outros">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Label>Descrição</Label>
                            <Input
                                placeholder="Descrição da despesa"
                                value={exitEditForm.description}
                                onChange={(event) =>
                                    setExitEditForm((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Valor</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="R$ 0,00"
                                value={exitEditForm.amount}
                                onChange={(event) =>
                                    setExitEditForm((prev) => ({
                                        ...prev,
                                        amount: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Forma de Pagamento</Label>
                            <Select
                                value={exitEditForm.paymentMethod}
                                onValueChange={(value) =>
                                    setExitEditForm((prev) => ({
                                        ...prev,
                                        paymentMethod: value ?? "",
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione">
                                        {(value: string) =>
                                            paymentLabels[String(value)] ?? "Selecione"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                    <SelectItem value="cartao">Cartão</SelectItem>
                                    <SelectItem value="debito">Débito</SelectItem>
                                    <SelectItem value="pix">PIX</SelectItem>
                                    <SelectItem value="boleto">Boleto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Label>Responsável</Label>
                            <Input
                                placeholder="Nome do responsável"
                                value={exitEditForm.responsible}
                                onChange={(event) =>
                                    setExitEditForm((prev) => ({
                                        ...prev,
                                        responsible: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            size="lg"
                            variant="destructive"
                            className="gap-2"
                            onClick={handleSaveExitEdit}
                            disabled={updateExit.isPending}
                        >
                            <ArrowDownRight className="h-4 w-4" />
                            {updateExit.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Caixa - Entradas e Saídas
                </h1>
                <p className="text-muted-foreground">
                    Controle completo do fluxo de caixa
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Total Entradas</p>
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-500">
                        R$ {totalEntries.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </Card>

                <Card className="p-6 border-l-4 border-l-destructive">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Total Saídas</p>
                        <ArrowDownRight className="h-5 w-5 text-destructive" />
                    </div>
                    <p className="text-3xl font-bold text-destructive">
                        R$ {totalExits.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </Card>

                <Card className="p-6 border-l-4 border-l-primary">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Saldo</p>
                        <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">
                        R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </Card>
            </div>

            <Tabs defaultValue="entradas" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="entradas" className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Entradas
                    </TabsTrigger>
                    <TabsTrigger value="saidas" className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4" />
                        Saídas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="entradas" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Histórico de Entradas</h3>
                            <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
                                <DialogTrigger
                                    render={
                                        <Button className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Registrar Entrada
                                        </Button>
                                    }
                                />
                                <DialogContent className="sm:max-w-4xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Plus className="h-5 w-5 text-green-500" />
                                            Registrar Entrada
                                        </DialogTitle>
                                    </DialogHeader>
                                    <Tabs defaultValue="instadelivery" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="instadelivery">InstaDelivery</TabsTrigger>
                                            <TabsTrigger value="ifood">Ifood</TabsTrigger>
                                            <TabsTrigger value="manual">Manual</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="instadelivery" className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label>Data</Label>
                                                    <Input
                                                        type="date"
                                                        value={instaForm.date}
                                                        onChange={(event) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                date: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Nome do Cliente</Label>
                                                    <Input
                                                        placeholder="Nome completo"
                                                        value={instaForm.customerName}
                                                        onChange={(event) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                customerName: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>WhatsApp</Label>
                                                    <Input
                                                        placeholder="(00) 00000-0000"
                                                        value={instaForm.whatsapp}
                                                        onChange={(event) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                whatsapp: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Entrega/Retirada</Label>
                                                    <Select
                                                        value={instaForm.fulfillmentType}
                                                        onValueChange={(value) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                fulfillmentType: value ?? "",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="entrega">Entrega</SelectItem>
                                                            <SelectItem value="retirada">Retirada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Taxa de Entrega</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="R$ 0,00"
                                                        value={instaForm.deliveryFee}
                                                        onChange={(event) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                deliveryFee: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Forma de Pagamento</Label>
                                                    <Select
                                                        value={instaForm.paymentMethod}
                                                        onValueChange={(value) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                paymentMethod: value ?? "",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value: string) =>
                                                                    paymentLabels[String(value)] ?? "Selecione"
                                                                }
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                            <SelectItem value="cartao">Cartão</SelectItem>
                                                            <SelectItem value="debito">Débito</SelectItem>
                                                            <SelectItem value="pix">PIX</SelectItem>
                                                            <SelectItem value="boleto">Boleto</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Valor Pago</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="R$ 0,00"
                                                        value={instaForm.amountPaid}
                                                        onChange={(event) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                amountPaid: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Status</Label>
                                                    <Select
                                                        value={instaForm.status}
                                                        onValueChange={(value) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                status: value ?? "pago",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value: string) =>
                                                                    statusLabels[String(value)] ?? "Selecione"
                                                                }
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pendente">Pendente</SelectItem>
                                                            <SelectItem value="pago">Pago</SelectItem>
                                                            <SelectItem value="cancelado">Cancelado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Itens do Pedido</Label>
                                                    <div className="mt-2">
                                                        {renderOrderItems(instaItems, setInstaItems)}
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Observacao</Label>
                                                    <Textarea
                                                        placeholder="Observacao adicional"
                                                        rows={2}
                                                        value={instaForm.notes}
                                                        onChange={(event) =>
                                                            setInstaForm((prev) => ({
                                                                ...prev,
                                                                notes: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    size="lg"
                                                    className="gap-2"
                                                    onClick={handleSaveInstadelivery}
                                                    disabled={createInstadeliveryEntry.isPending}
                                                >
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    {createInstadeliveryEntry.isPending ? "Salvando..." : "Salvar"}
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="ifood" className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label>Data</Label>
                                                    <Input
                                                        type="date"
                                                        value={ifoodForm.date}
                                                        onChange={(event) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                date: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Nome do Cliente</Label>
                                                    <Input
                                                        placeholder="Nome completo"
                                                        value={ifoodForm.customerName}
                                                        onChange={(event) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                customerName: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>WhatsApp</Label>
                                                    <Input
                                                        placeholder="(00) 00000-0000"
                                                        value={ifoodForm.whatsapp}
                                                        onChange={(event) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                whatsapp: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Entrega/Retirada</Label>
                                                    <Select
                                                        value={ifoodForm.fulfillmentType}
                                                        onValueChange={(value) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                fulfillmentType: value ?? "",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="entrega">Entrega</SelectItem>
                                                            <SelectItem value="retirada">Retirada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Taxa de Entrega</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="R$ 0,00"
                                                        value={ifoodForm.deliveryFee}
                                                        onChange={(event) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                deliveryFee: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Forma de Pagamento</Label>
                                                    <Select
                                                        value={ifoodForm.paymentMethod}
                                                        onValueChange={(value) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                paymentMethod: value ?? "",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value: string) =>
                                                                    paymentLabels[String(value)] ?? "Selecione"
                                                                }
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                            <SelectItem value="cartao">Cartão</SelectItem>
                                                            <SelectItem value="debito">Débito</SelectItem>
                                                            <SelectItem value="pix">PIX</SelectItem>
                                                            <SelectItem value="boleto">Boleto</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Valor Pago</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="R$ 0,00"
                                                        value={ifoodForm.amountPaid}
                                                        onChange={(event) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                amountPaid: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Status</Label>
                                                    <Select
                                                        value={ifoodForm.status}
                                                        onValueChange={(value) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                status: value ?? "pago",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value: string) =>
                                                                    statusLabels[String(value)] ?? "Selecione"
                                                                }
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pendente">Pendente</SelectItem>
                                                            <SelectItem value="pago">Pago</SelectItem>
                                                            <SelectItem value="cancelado">Cancelado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Itens do Pedido</Label>
                                                    <div className="mt-2">
                                                        {renderOrderItems(ifoodItems, setIfoodItems)}
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Observacao</Label>
                                                    <Textarea
                                                        placeholder="Observacao adicional"
                                                        rows={2}
                                                        value={ifoodForm.notes}
                                                        onChange={(event) =>
                                                            setIfoodForm((prev) => ({
                                                                ...prev,
                                                                notes: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    size="lg"
                                                    className="gap-2"
                                                    onClick={handleSaveIfood}
                                                    disabled={createIfoodEntry.isPending}
                                                >
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    {createIfoodEntry.isPending ? "Salvando..." : "Salvar"}
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="manual" className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label>Data</Label>
                                                    <Input
                                                        type="date"
                                                        value={manualForm.date}
                                                        onChange={(event) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                date: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Nome do Cliente</Label>
                                                    <Input
                                                        placeholder="Nome completo"
                                                        value={manualForm.customerName}
                                                        onChange={(event) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                customerName: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>WhatsApp</Label>
                                                    <Input
                                                        placeholder="(00) 00000-0000"
                                                        value={manualForm.whatsapp}
                                                        onChange={(event) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                whatsapp: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Entrega/Retirada</Label>
                                                    <Select
                                                        value={manualForm.fulfillmentType}
                                                        onValueChange={(value) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                fulfillmentType: value ?? "",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="entrega">Entrega</SelectItem>
                                                            <SelectItem value="retirada">Retirada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Taxa de Entrega</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="R$ 0,00"
                                                        value={manualForm.deliveryFee}
                                                        onChange={(event) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                deliveryFee: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Forma de Pagamento</Label>
                                                    <Select
                                                        value={manualForm.paymentMethod}
                                                        onValueChange={(value) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                paymentMethod: value ?? "",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value: string) =>
                                                                    paymentLabels[String(value)] ?? "Selecione"
                                                                }
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                            <SelectItem value="cartao">Cartão</SelectItem>
                                                            <SelectItem value="debito">Débito</SelectItem>
                                                            <SelectItem value="pix">PIX</SelectItem>
                                                            <SelectItem value="boleto">Boleto</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Valor Pago</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="R$ 0,00"
                                                        value={manualForm.amountPaid}
                                                        onChange={(event) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                amountPaid: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Status</Label>
                                                    <Select
                                                        value={manualForm.status}
                                                        onValueChange={(value) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                status: value ?? "pago",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value: string) =>
                                                                    statusLabels[String(value)] ?? "Selecione"
                                                                }
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pendente">Pendente</SelectItem>
                                                            <SelectItem value="pago">Pago</SelectItem>
                                                            <SelectItem value="cancelado">Cancelado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Itens do Pedido</Label>
                                                    <div className="mt-2">
                                                        {renderOrderItems(manualItems, setManualItems)}
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Observacao</Label>
                                                    <Textarea
                                                        placeholder="Observacao adicional"
                                                        rows={2}
                                                        value={manualForm.notes}
                                                        onChange={(event) =>
                                                            setManualForm((prev) => ({
                                                                ...prev,
                                                                notes: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    size="lg"
                                                    className="gap-2"
                                                    onClick={handleSaveManual}
                                                    disabled={createManualEntry.isPending}
                                                >
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    {createManualEntry.isPending ? "Salvando..." : "Salvar"}
                                                </Button>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Valor Pago</TableHead>
                                        <TableHead>Forma de Pagamento</TableHead>
                                        <TableHead>Entrega/Retirada</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isEntriesLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Carregando entradas...
                                            </TableCell>
                                        </TableRow>
                                    ) : combinedEntries.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                sem dados cadastrados
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        combinedEntries.map((entry) => (
                                            <TableRow key={`${entry.source}-${entry.id}`}>
                                                <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
                                                <TableCell>{entry.customerName}</TableCell>
                                                <TableCell className="font-bold text-green-500">
                                                    R${" "}
                                                    {entry.amountPaid.toLocaleString("pt-BR", {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {paymentLabels[entry.paymentMethod] ?? entry.paymentMethod}
                                                </TableCell>
                                                <TableCell>
                                                    {fulfillmentLabels[entry.fulfillmentType] ?? entry.fulfillmentType}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditModal(entry)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => requestDeleteEntry(entry)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="saidas" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Histórico de Saídas</h3>
                            <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
                                <DialogTrigger
                                    render={
                                        <Button variant="destructive" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Registrar Saída
                                        </Button>
                                    }
                                />
                                <DialogContent className="sm:max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Plus className="h-5 w-5 text-destructive" />
                                            Registrar Saída
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                        <div>
                                            <Label>Data</Label>
                                            <Input
                                                type="date"
                                                value={exitForm.date}
                                                onChange={(event) =>
                                                    setExitForm((prev) => ({
                                                        ...prev,
                                                        date: event.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Categoria</Label>
                                            <Select
                                                value={exitForm.category}
                                                onValueChange={(value) =>
                                                    setExitForm((prev) => ({
                                                        ...prev,
                                                        category: value ?? "",
                                                    }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione">
                                                        {(value: string) =>
                                                            exitCategoryLabels[String(value)] ?? "Selecione"
                                                        }
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="materia">Matéria-prima</SelectItem>
                                                    <SelectItem value="energia">Energia</SelectItem>
                                                    <SelectItem value="agua">Água</SelectItem>
                                                    <SelectItem value="gas">Gás</SelectItem>
                                                    <SelectItem value="aluguel">Aluguel</SelectItem>
                                                    <SelectItem value="outros">Outros</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Descrição</Label>
                                            <Input
                                                placeholder="Descrição da despesa"
                                                value={exitForm.description}
                                                onChange={(event) =>
                                                    setExitForm((prev) => ({
                                                        ...prev,
                                                        description: event.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Valor</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="R$ 0,00"
                                                value={exitForm.amount}
                                                onChange={(event) =>
                                                    setExitForm((prev) => ({
                                                        ...prev,
                                                        amount: event.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Forma de Pagamento</Label>
                                            <Select
                                                value={exitForm.paymentMethod}
                                                onValueChange={(value) =>
                                                    setExitForm((prev) => ({
                                                        ...prev,
                                                        paymentMethod: value ?? "",
                                                    }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione">
                                                        {(value: string) =>
                                                            paymentLabels[String(value)] ?? "Selecione"
                                                        }
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                    <SelectItem value="cartao">Cartão</SelectItem>
                                                    <SelectItem value="debito">Débito</SelectItem>
                                                    <SelectItem value="pix">PIX</SelectItem>
                                                    <SelectItem value="boleto">Boleto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Responsável</Label>
                                            <Input
                                                placeholder="Nome do responsável"
                                                value={exitForm.responsible}
                                                onChange={(event) =>
                                                    setExitForm((prev) => ({
                                                        ...prev,
                                                        responsible: event.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            size="lg"
                                            variant="destructive"
                                            className="gap-2"
                                            onClick={handleSaveExit}
                                            disabled={createExit.isPending}
                                        >
                                            <ArrowDownRight className="h-4 w-4" />
                                            {createExit.isPending ? "Salvando..." : "Registrar Saída"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Pagamento</TableHead>
                                        <TableHead>Responsável</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingExits ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Carregando saídas...
                                            </TableCell>
                                        </TableRow>
                                    ) : exitsList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                sem dados cadastrados
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        exitsList.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{format(new Date(item.date), "dd/MM/yyyy")}</TableCell>
                                                <TableCell>
                                                    {exitCategoryLabels[item.category] ?? item.category}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {item.description}
                                                </TableCell>
                                                <TableCell className="font-bold text-destructive">
                                                    R${" "}
                                                    {item.amount.toLocaleString("pt-BR", {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {paymentLabels[item.paymentMethod] ?? item.paymentMethod}
                                                </TableCell>
                                                <TableCell>{item.responsible}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openExitEditModal(item)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => requestDeleteExit(item)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
