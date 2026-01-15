import ProtectedRoute from "@/components/protected-route";

export default function ConfiguracoesPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Configurações</h2>
          <p className="text-muted-foreground">
            Configure sua aplicação aqui.
          </p>
        </div>
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">Área de configurações em desenvolvimento</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}