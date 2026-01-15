import ProtectedRoute from "@/components/protected-route";

export default function InventarioPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Inventário</h2>
          <p className="text-muted-foreground">
            Gerencie seu inventário aqui.
          </p>
        </div>
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">Área de inventário em desenvolvimento</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}