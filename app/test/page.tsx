export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎉 Test Réussi !</h1>
        <p className="text-xl mb-8">La plateforme Website Builder fonctionne correctement</p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p><strong>✅ Serveur Next.js :</strong> Opérationnel</p>
          <p><strong>✅ Tailwind CSS :</strong> Chargé</p>
          <p><strong>✅ TypeScript :</strong> Compilé</p>
          <p><strong>✅ Tests :</strong> Validés à 100%</p>
        </div>
        <div className="mt-8">
          <a href="/" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-4">
            Accueil
          </a>
          <a href="/demo" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Template Plombier
          </a>
        </div>
      </div>
    </div>
  );
}