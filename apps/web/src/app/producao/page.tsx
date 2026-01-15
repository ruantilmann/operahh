import ProtectedRoute from "@/components/protected-route";

export default function ProducaoPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Produção</h2>
          <p className="text-muted-foreground">
            Gerencie sua produção aqui.
          </p>
        </div>
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">Área de produção em desenvolvimento</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}