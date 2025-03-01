import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Material {
  id: string;
  code: string;
  name: string;
  unit: string;
}

const Materials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    unit: "",
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMaterials([
        { id: "1", code: "TRG01", name: "Terigu", unit: "kg" },
        { id: "2", code: "GLA01", name: "Gula", unit: "kg" },
        { id: "3", code: "TLR01", name: "Telur", unit: "kg" },
        { id: "4", code: "RGI01", name: "Ragi", unit: "kg" },
        { id: "5", code: "KJU01", name: "Keju", unit: "kg" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMaterial = () => {
    // In a real app, this would call the API
    const newMaterial: Material = {
      id: Date.now().toString(),
      ...formData,
    };
    
    setMaterials([...materials, newMaterial]);
    toast.success("Bahan baku berhasil ditambahkan");
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditMaterial = () => {
    if (!currentMaterial) return;
    
    // In a real app, this would call the API
    const updatedMaterials = materials.map((m) =>
      m.id === currentMaterial.id ? { ...currentMaterial, ...formData } : m
    );
    
    setMaterials(updatedMaterials);
    toast.success("Bahan baku berhasil diperbarui");
    resetForm();
    setIsDialogOpen(false);
    setIsEditing(false);
  };

  const handleDeleteMaterial = (id: string) => {
    // In a real app, this would call the API
    setMaterials(materials.filter((m) => m.id !== id));
    toast.success("Bahan baku berhasil dihapus");
  };

  const prepareEdit = (material: Material) => {
    setCurrentMaterial(material);
    setFormData({
      code: material.code,
      name: material.name,
      unit: material.unit,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ code: "", name: "", unit: "" });
    setCurrentMaterial(null);
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bahan Baku</h2>
          <p className="text-muted-foreground">
            Kelola data bahan baku yang digunakan.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                resetForm();
                setIsEditing(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Bahan Baku
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Bahan Baku" : "Tambah Bahan Baku"}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Perbarui informasi bahan baku di sini." 
                  : "Masukkan data bahan baku baru di sini."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Kode
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Satuan
                </Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                type="submit" 
                onClick={isEditing ? handleEditMaterial : handleAddMaterial}
              >
                {isEditing ? "Perbarui" : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Cari bahan baku..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">Kode</TableHead>
                <TableHead>Nama Bahan</TableHead>
                <TableHead className="w-[100px]">Satuan</TableHead>
                <TableHead className="w-[120px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex justify-center">
                      <div className="animate-pulse space-y-2">
                        <div className="h-2.5 bg-muted rounded-full w-24 mb-2.5"></div>
                        <div className="h-2.5 bg-muted rounded-full w-32"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Tidak ada data bahan baku
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map((material) => (
                  <TableRow key={material.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{material.code}</TableCell>
                    <TableCell>{material.name}</TableCell>
                    <TableCell>{material.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => prepareEdit(material)}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Materials;
