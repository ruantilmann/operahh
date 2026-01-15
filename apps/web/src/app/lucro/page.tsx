import ProtectedRoute from "@/components/protected-route";

export default function LucroPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Lucro</h2>
          <p className="text-muted-foreground">
            Gerencie seu lucro aqui.
          </p>
        </div>
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">Área de lucro em desenvolvimento</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}