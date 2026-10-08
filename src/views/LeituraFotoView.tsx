import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  Check,
  Package,
  Layers,
  FileCheck
} from 'lucide-react';

interface PresetCase {
  id: string;
  nome: string;
  categoria: string;
  produto: string;
  fabricante: string;
  codigo: string;
  lote: string;
  validade: string;
  quantidade: number;
  confiancaGeral: number;
  confiancaValidade: number;
  unidade: string;
  insumoId: string;
  imagemUrl: string;
  boundingBoxes: { id: number; x: number; y: number; w: number; h: number; label: string }[];
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'case-powerquant',
    nome: 'Bancada: 6 Frascos PowerQuant Standard (Promega)',
    categoria: 'Kits de Quantificação',
    produto: 'PowerQuant System gDNA Standard',
    fabricante: 'Promega Corporation',
    codigo: 'DQ123456',
    lote: 'PQ2026-014',
    validade: '31/08/2027',
    quantidade: 6,
    confiancaGeral: 98,
    confiancaValidade: 98,
    unidade: 'frascos',
    insumoId: 'ins-03',
    imagemUrl: 'powerquant',
    boundingBoxes: [
      { id: 1, x: 18, y: 35, w: 10, h: 42, label: '#1 PQ-014' },
      { id: 2, x: 30, y: 34, w: 10, h: 44, label: '#2 PQ-014' },
      { id: 3, x: 43, y: 32, w: 10, h: 46, label: '#3 PQ-014' },
      { id: 4, x: 56, y: 33, w: 10, h: 45, label: '#4 PQ-014' },
      { id: 5, x: 68, y: 35, w: 10, h: 43, label: '#5 PQ-014' },
      { id: 6, x: 80, y: 36, w: 10, h: 41, label: '#6 PQ-014' }
    ]
  },
  {
    id: 'case-fusion',
    nome: 'Caixa Primária: PowerPlex Fusion 6C (200 rxns)',
    categoria: 'Kits de Amplificação (STR)',
    produto: 'PowerPlex Fusion 6C System (200 rxns)',
    fabricante: 'Promega Corporation',
    codigo: 'DC2402',
    lote: 'FUS-2026-022',
    validade: '15/11/2027',
    quantidade: 2,
    confiancaGeral: 96,
    confiancaValidade: 74, // Simulated lower confidence test case!
    unidade: 'kits',
    insumoId: 'ins-01',
    imagemUrl: 'fusion',
    boundingBoxes: [
      { id: 1, x: 22, y: 28, w: 26, h: 54, label: '#1 Fusion 6C' },
      { id: 2, x: 54, y: 26, w: 28, h: 56, label: '#2 Fusion 6C' }
    ]
  },
  {
    id: 'case-pop4',
    nome: 'Embalagem Rótulo: POP-4 Polymer 3500 (ABI)',
    categoria: 'Polímeros e Eletroforese',
    produto: 'POP-4 Polymer 3500 Series (960 amostras)',
    fabricante: 'Thermo Fisher Scientific / ABI',
    codigo: '4393710',
    lote: 'POP4-26-880',
    validade: '30/03/2027',
    quantidade: 3,
    confiancaGeral: 99,
    confiancaValidade: 96,
    unidade: 'bolsas (pouch)',
    insumoId: 'ins-06',
    imagemUrl: 'pop4',
    boundingBoxes: [
      { id: 1, x: 20, y: 30, w: 18, h: 48, label: '#1 Pouch 3500' },
      { id: 2, x: 42, y: 28, w: 18, h: 50, label: '#2 Pouch 3500' },
      { id: 3, x: 64, y: 31, w: 18, h: 47, label: '#3 Pouch 3500' }
    ]
  }
];

export const LeituraFotoView: React.FC = () => {
  const { insumos, confirmarEntradaEstoque, navigate } = useApp();

  const [selectedCase, setSelectedCase] = useState<PresetCase>(PRESET_CASES[0]);
  const [stage, setStage] = useState<'idle' | 'scanning' | 'analyzed' | 'confirmed'>('idle');
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Editable recognized fields
  const [formData, setFormData] = useState({
    produto: PRESET_CASES[0].produto,
    fabricante: PRESET_CASES[0].fabricante,
    codigo: PRESET_CASES[0].codigo,
    lote: PRESET_CASES[0].lote,
    validade: '2027-08-31',
    validadeFormatada: PRESET_CASES[0].validade,
    quantidade: PRESET_CASES[0].quantidade,
    insumoId: PRESET_CASES[0].insumoId,
    unidade: PRESET_CASES[0].unidade
  });

  const [scanStep, setScanStep] = useState(0);

  const startScan = (targetCase: PresetCase) => {
    setSelectedCase(targetCase);
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = targetCase.validade.split('/');
    const ymd = `${parts[2]}-${parts[1]}-${parts[0]}`;

    setFormData({
      produto: targetCase.produto,
      fabricante: targetCase.fabricante,
      codigo: targetCase.codigo,
      lote: targetCase.lote,
      validade: ymd,
      validadeFormatada: targetCase.validade,
      quantidade: targetCase.quantidade,
      insumoId: targetCase.insumoId,
      unidade: targetCase.unidade
    });

    setStage('scanning');
    setScanStep(1);

    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1200);
    setTimeout(() => {
      setScanStep(4);
      setStage('analyzed');
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        startScan(PRESET_CASES[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulatedCamera = () => {
    startScan(PRESET_CASES[0]);
  };

  const handleConfirm = () => {
    confirmarEntradaEstoque({
      insumoId: formData.insumoId,
      numeroLote: formData.lote,
      validade: formData.validade,
      quantidade: formData.quantidade,
      fornecedor: formData.fabricante,
      origem: 'Fotografia (OCR)',
      observacoes: `Entrada assistida por OCR e contagem visual (${formData.quantidade} ${formData.unidade} detectados com ${selectedCase.confiancaGeral}% de confiança).`
    });
    setStage('confirmed');
  };

  const currentInsumo = insumos.find((i) => i.id === formData.insumoId);
  const estoqueAtual = currentInsumo?.quantidadeAtual || 8;
  const novoEstoque = estoqueAtual + formData.quantidade;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
              Registrar estoque por fotografia
            </h2>
            <span className="text-[11px] font-semibold text-[#2A9D8F] bg-[#2A9D8F]/10 px-2 py-0.5 rounded-xs uppercase tracking-wide">
              OCR & Visão Computacional
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
            Envie uma fotografia do rótulo ou dos insumos recebidos para identificação automática de lote, fabricante, validade e contagem visual de unidades.
          </p>
        </div>

        {stage === 'confirmed' && (
          <button
            onClick={() => {
              setStage('idle');
              setCustomImage(null);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#123B5D] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#0e2f4a] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Nova Leitura por Fotografia</span>
          </button>
        )}
      </div>

      {/* Preset Demo Selector */}
      {stage === 'idle' && (
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2A9D8F]" />
              Casos Reais de Demonstração (Clique para testar o reconhecimento)
            </span>
            <span className="text-[11px] text-[#667085]">
              Simulação calibrada com insumos forenses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_CASES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => startScan(preset)}
                className="text-left p-3.5 rounded-lg border border-[#D9E1E8] hover:border-[#123B5D] hover:bg-[#F8FAFC] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-[#667085] mb-1">
                  <span>{preset.categoria}</span>
                  <span className="font-semibold text-[#2E7D5B]">
                    {preset.confiancaGeral}% confiança
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#1F2933] group-hover:text-[#123B5D] transition-colors">
                  {preset.nome}
                </h4>
                <div className="mt-2 pt-2 border-t border-[#D9E1E8]/70 flex items-center justify-between text-[11px] text-[#667085]">
                  <span>Lote: <strong>{preset.lote}</strong></span>
                  <span className="font-mono text-[#123B5D] font-bold">
                    +{preset.quantidade} {preset.unidade}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Upload / Scanning Stage */}
      {stage === 'idle' && (
        <div className="bg-white border border-dashed border-[#D9E1E8] rounded-xl p-8 md:p-12 text-center shadow-xs">
          <div className="max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#123B5D]/5 text-[#123B5D] flex items-center justify-center mb-4">
              <UploadCloud className="w-7 h-7 text-[#2A6F97]" />
            </div>

            <h3 className="text-base font-bold text-[#1F2933]">
              Arraste uma imagem ou clique para enviar
            </h3>
            <p className="text-xs text-[#667085] mt-1 mb-6">
              Formatos aceitos: JPG, JPEG, PNG, WEBP (resolução mínima recomendada 1200x800)
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="w-full sm:w-auto px-4 py-2.5 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2">
                <UploadCloud className="w-4 h-4" />
                <span>Selecionar fotografia</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              <button
                onClick={handleSimulatedCamera}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-[#F4F7F9] text-[#123B5D] border border-[#D9E1E8] text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#2A9D8F]" />
                <span>Usar câmera do terminal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Animation */}
      {stage === 'scanning' && (
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-8 md:p-12 shadow-xs text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative w-20 h-20 mx-auto rounded-2xl bg-[#123B5D] text-white flex items-center justify-center shadow-lg">
              <Camera className="w-9 h-9 text-[#2A9D8F] animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border-2 border-[#2A9D8F] animate-ping opacity-25" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#123B5D]">
                Analisando imagem...
              </h3>
              <p className="text-xs text-[#667085] mt-0.5">
                Processamento por OCR morfológico e detecção de bounding boxes
              </p>
            </div>

            <div className="space-y-2 pt-2 text-left bg-[#F8FAFC] p-4 rounded-lg border border-[#D9E1E8]">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    scanStep >= 1 ? 'text-[#2E7D5B]' : 'text-slate-300'
                  }`}
                />
                <span className={scanStep >= 1 ? 'text-[#1F2933] font-medium' : 'text-slate-400'}>
                  Segmentação e correção de perspectiva do rótulo
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    scanStep >= 2 ? 'text-[#2E7D5B]' : 'text-slate-300'
                  }`}
                />
                <span className={scanStep >= 2 ? 'text-[#1F2933] font-medium' : 'text-slate-400'}>
                  Extração de strings OCR: Lote, Validade e Fabricante
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    scanStep >= 3 ? 'text-[#2E7D5B]' : 'text-slate-300'
                  }`}
                />
                <span className={scanStep >= 3 ? 'text-[#1F2933] font-medium' : 'text-slate-400'}>
                  Detecção visual de recipientes e contagem de frascos
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    scanStep >= 4 ? 'text-[#2E7D5B]' : 'text-slate-300'
                  }`}
                />
                <span className={scanStep >= 4 ? 'text-[#1F2933] font-medium' : 'text-slate-400'}>
                  Cálculo de índice de confiança e cruzamento com base de dados
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analyzed Result View */}
      {stage === 'analyzed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Visual Viewport with Bounding Boxes */}
          <div className="lg:col-span-7 bg-white border border-[#D9E1E8] rounded-xl shadow-xs p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E8] mb-3">
              <div>
                <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#2A6F97]" />
                  Objetos identificados por visão computacional
                </h3>
                <p className="text-[11px] text-[#667085]">
                  Contagem automatizada e delimitação dos insumos
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#2E7D5B] bg-[#2E7D5B]/10 px-2 py-0.5 rounded-xs">
                  {selectedCase.boundingBoxes.length} unidades identificadas
                </span>
              </div>
            </div>

            {/* Visual Simulator Canvas / Image Stage */}
            <div className="relative w-full aspect-16/10 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700">
              {/* Background Mock Photographic Texture */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-slate-400 p-6">
                <div className="w-full h-full border border-slate-700/60 rounded-md relative flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <Package className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedCase.nome}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      FOTOGRAFIA FORENSE DIGITALIZADA — TERMINAL LAB DNA
                    </p>
                  </div>

                  {/* Simulated Bounding Boxes over image */}
                  {selectedCase.boundingBoxes.map((box) => (
                    <div
                      key={box.id}
                      style={{
                        position: 'absolute',
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.w}%`,
                        height: `${box.h}%`
                      }}
                      className="border-2 border-[#2A9D8F] bg-[#2A9D8F]/15 rounded-xs flex flex-col justify-between p-1 shadow-sm transition-transform hover:scale-105"
                    >
                      <div className="bg-[#2A9D8F] text-slate-950 font-bold font-mono text-[9px] px-1 py-0.2 rounded-xs w-fit leading-none">
                        #{box.id}
                      </div>
                      <div className="bg-slate-900/90 text-[#E9C46A] font-mono text-[8px] px-1 rounded-xs truncate">
                        {box.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom HUD overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs border border-slate-800 text-[11px] text-slate-300 py-1.5 px-3 rounded-md flex items-center justify-between font-mono">
                <span>SENSOR: RECONHECIMENTO ÓPTICO 4K</span>
                <span className="text-[#2A9D8F]">CONTAGEM: {selectedCase.boundingBoxes.length} OBJETOS</span>
                <span className="text-slate-400">STATUS: RÓTULO LEGÍVEL</span>
              </div>
            </div>

            {/* Confidence indicator badge */}
            <div className="mt-4 p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E1E8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D5B]" />
                <span className="text-xs text-[#1F2933] font-medium">
                  Leitura concluída com sucesso
                </span>
              </div>
              <div className="text-xs font-mono font-semibold text-[#123B5D]">
                Índice de Confiança: <span className="text-[#2E7D5B]">{selectedCase.confiancaGeral}%</span>
              </div>
            </div>

            {/* Low confidence warning simulation (for Fusion 6C case) */}
            {selectedCase.confiancaValidade < 80 && (
              <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-[#D98E04]/30 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#D98E04] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-[#D98E04]">
                    Validade com confiança parcial ({selectedCase.confiancaValidade}%)
                  </span>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Revise esta informação antes de confirmar. A data impressa no frasco parece ser {formData.validadeFormatada}.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Identified Information & Movement Summary */}
          <div className="lg:col-span-5 space-y-5">
            {/* Card: Informações identificadas */}
            <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs p-4">
              <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider mb-3 pb-2 border-b border-[#D9E1E8] flex items-center justify-between">
                <span>Informações Identificadas (OCR)</span>
                <span className="text-[10px] text-[#2A6F97] font-semibold">Editável</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
                    Produto
                  </label>
                  <input
                    type="text"
                    value={formData.produto}
                    onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md font-medium text-[#1F2933]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
                      Fabricante
                    </label>
                    <input
                      type="text"
                      value={formData.fabricante}
                      onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
                      Código / Catálogo
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
                      Lote Detectado
                    </label>
                    <input
                      type="text"
                      value={formData.lote}
                      onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
                      Validade
                    </label>
                    <input
                      type="date"
                      value={formData.validade}
                      onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
                    Quantidade Identificada
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={formData.quantidade}
                      onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value, 10) || 1 })}
                      className="w-24 px-2.5 py-1.5 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] font-mono font-bold text-sm"
                    />
                    <span className="text-xs text-[#667085]">
                      {formData.unidade} (contados por imagem)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Resumo da movimentação */}
            <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs p-4">
              <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider mb-3 pb-2 border-b border-[#D9E1E8]">
                Resumo da Movimentação
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#D9E1E8]/50">
                  <span className="text-[#667085]">Produto</span>
                  <span className="font-semibold text-[#1F2933] text-right truncate max-w-[200px]">
                    {formData.produto}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D9E1E8]/50">
                  <span className="text-[#667085]">Lote</span>
                  <span className="font-mono font-semibold text-[#1F2933]">
                    {formData.lote}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D9E1E8]/50">
                  <span className="text-[#667085]">Validade</span>
                  <span className="font-mono text-[#1F2933]">
                    {formData.validade}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D9E1E8]/50">
                  <span className="text-[#667085]">Estoque atual</span>
                  <span className="font-mono text-[#667085] tabular-nums">
                    {estoqueAtual} {formData.unidade}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D9E1E8]/50">
                  <span className="text-[#2E7D5B] font-semibold">Movimentação</span>
                  <span className="font-mono font-bold text-[#2E7D5B] tabular-nums">
                    +{formData.quantidade} {formData.unidade}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 pt-2 font-bold text-sm bg-[#F8FAFC] px-2 rounded-md">
                  <span className="text-[#123B5D]">Novo estoque</span>
                  <span className="font-mono text-[#123B5D] tabular-nums">
                    {novoEstoque} {formData.unidade}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 px-4 bg-[#2E7D5B] hover:bg-[#25664a] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar entrada</span>
                </button>

                <button
                  onClick={() => setStage('idle')}
                  className="py-2.5 px-3 bg-white hover:bg-[#F4F7F9] text-[#667085] border border-[#D9E1E8] text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  Corrigir dados / Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmed Stage with Full Traceability Feedback */}
      {stage === 'confirmed' && (
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-8 shadow-xs text-center">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-lg font-bold text-[#123B5D]">
              Entrada Registrada com Sucesso!
            </h3>

            <p className="text-xs text-[#667085] leading-relaxed">
              O lote <strong>{formData.lote}</strong> foi incorporado ao estoque de <strong>{formData.produto}</strong> com rastreabilidade completa e registro fotográfico arquivado.
            </p>

            {/* Traceability Summary Card */}
            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#D9E1E8] text-xs text-left space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#667085]">Operador Responsável:</span>
                <span className="font-semibold text-[#1F2933]">Paulo Chaves (Responsável Técnico)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#667085]">Data e Horário:</span>
                <span className="font-mono text-[#1F2933]">08/10/2026 às 08:35</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#667085]">Método de Registro:</span>
                <span className="text-[#2A6F97] font-medium">Reconhecimento Óptico (OCR) + Bounding Boxes</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#667085]">Saldo Anterior / Atual:</span>
                <span className="font-mono font-bold text-[#123B5D]">
                  {estoqueAtual} → {novoEstoque} {formData.unidade} (+{formData.quantidade})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/estoque/movimentacoes')}
                className="px-4 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Ver no Histórico de Movimentações</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigate('/estoque')}
                className="px-4 py-2 bg-white hover:bg-[#F4F7F9] text-[#123B5D] border border-[#D9E1E8] text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Ir para Estoque Geral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
