import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo2026.png";
import { ChevronLeft, ChevronRight, Send, Zap, Swords, Dumbbell, Timer, MapPin } from "lucide-react";

interface FormData {
  pseudo: string;
  email: string;
  telephone: string;
  age: string;
  sexe: string;
  style_anime: string;
  objectif_fitness: string;
  niveau_sportif: string;
  frequence_entrainement: string;
  motivation: string;
  adresse_rue: string;
  adresse_ville: string;
  adresse_code_postal: string;
  adresse_pays: string;
}

const initialData: FormData = {
  pseudo: "", email: "", telephone: "", age: "", sexe: "",
  style_anime: "", objectif_fitness: "", niveau_sportif: "",
  frequence_entrainement: "", motivation: "",
  adresse_rue: "", adresse_ville: "", adresse_code_postal: "", adresse_pays: "",
};

type QuestionConfig = {
  key: keyof FormData;
  label: string;
  subtitle: string;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea" | "address";
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  required?: boolean;
  placeholder?: string;
};

const questions: QuestionConfig[] = [
  { key: "pseudo", label: "Quel est ton nom de héros ?", subtitle: "Choisis un pseudo digne d'un shōnen", type: "text", required: true, placeholder: "Ex: ShadowFlex, GokuFit..." },
  { key: "email", label: "Ton adresse email", subtitle: "Pour recevoir tes missions d'entraînement", type: "email", required: true, placeholder: "hero@fitnessanim.com" },
  { key: "telephone", label: "Ton numéro de téléphone", subtitle: "Pour les notifications de combat", type: "tel", placeholder: "+33 6 XX XX XX XX" },
  { key: "age", label: "Quel âge as-tu ?", subtitle: "On adapte ton parcours de guerrier", type: "number", required: true, placeholder: "25" },
  { key: "sexe", label: "Tu es...", subtitle: "Pour personnaliser ton avatar", type: "select", required: true, options: [
    { value: "homme", label: "Homme" },
    { value: "femme", label: "Femme" },
    { value: "autre", label: "Autre" },
  ]},
  { key: "style_anime", label: "Quel est ton style d'anime ?", subtitle: "Ton arc narratif commence ici", type: "select", required: true, options: [
    { value: "shonen", label: "Shōnen", icon: <Swords className="w-5 h-5" /> },
    { value: "mecha", label: "Mecha", icon: <Zap className="w-5 h-5" /> },
    { value: "cyberpunk", label: "Cyberpunk", icon: <Timer className="w-5 h-5" /> },
  ]},
  { key: "objectif_fitness", label: "Quel est ton objectif ?", subtitle: "Chaque héros a sa quête", type: "select", required: true, options: [
    { value: "endurance", label: "Devenir Hokage (Endurance)" },
    { value: "masse", label: "Devenir Super Saiyan (Masse)" },
    { value: "perte_poids", label: "Perdre du poids (Agility)" },
    { value: "tonification", label: "Tonification (Équilibre)" },
  ]},
  { key: "niveau_sportif", label: "Ton niveau sportif actuel ?", subtitle: "De débutant à légende", type: "select", required: true, options: [
    { value: "debutant", label: "Débutant — Genin" },
    { value: "intermediaire", label: "Intermédiaire — Chūnin" },
    { value: "avance", label: "Avancé — Jōnin" },
    { value: "expert", label: "Expert — Kage" },
  ]},
  { key: "frequence_entrainement", label: "Combien de fois par semaine ?", subtitle: "Ton rythme de combat", type: "select", required: true, options: [
    { value: "1-2", label: "1-2 fois" },
    { value: "3-4", label: "3-4 fois" },
    { value: "5+", label: "5+ fois (Beast Mode)" },
  ]},
  { key: "motivation", label: "Qu'est-ce qui te motive ?", subtitle: "Dis-nous ce qui fait brûler ta flamme intérieure", type: "textarea", placeholder: "Je veux dépasser mes limites comme..." },
];

// Question 11 is address, handled separately in step 10

export default function FitnessAnimForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = questions.length + 1; // +1 for address

  const isAddressStep = step === questions.length;
  const currentQ = !isAddressStep ? questions[step] : null;

  const canNext = () => {
    if (isAddressStep) {
      return formData.adresse_rue && formData.adresse_ville && formData.adresse_code_postal && formData.adresse_pays;
    }
    const q = questions[step];
    if (!q.required) return true;
    return !!formData[q.key];
  };

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("guest_responses").insert({
        pseudo: formData.pseudo,
        email: formData.email,
        telephone: formData.telephone || null,
        age: formData.age ? parseInt(formData.age) : null,
        sexe: formData.sexe || null,
        style_anime: formData.style_anime || null,
        objectif_fitness: formData.objectif_fitness || null,
        niveau_sportif: formData.niveau_sportif || null,
        frequence_entrainement: formData.frequence_entrainement || null,
        motivation: formData.motivation || null,
        adresse_rue: formData.adresse_rue || null,
        adresse_ville: formData.adresse_ville || null,
        adresse_code_postal: formData.adresse_code_postal || null,
        adresse_pays: formData.adresse_pays || null,
      });
      if (error) throw error;
      setIsComplete(true);
      toast.success("Inscription réussie ! Bienvenue, héros !");
    } catch (err: any) {
      toast.error("Erreur : " + (err.message || "Réessaie plus tard"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => {
    if (step < totalSteps - 1) setStep(s => s + 1);
    else handleSubmit();
  };
  const prev = () => step > 0 && setStep(s => s - 1);

  const progress = ((step + 1) / totalSteps) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <img src={logo} alt="FitnessAnim" className="w-32 h-32 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-display glow-text-purple text-primary mb-4">
            Bienvenue, {formData.pseudo} !
          </h1>
          <p className="text-muted-foreground text-lg">
            Ton arc d'entraînement commence maintenant. Prépare-toi au combat !
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background aura effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center mb-6"
        >
          <img src={logo} alt="FitnessAnim" className="w-20 h-20" />
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground font-body font-semibold uppercase tracking-wider">
              Étape {step + 1} / {totalSteps}
            </span>
            <span className="text-xs text-primary font-body font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-surface rounded-2xl p-6 md:p-8"
          >
            {isAddressStep ? (
              <AddressStep formData={formData} onChange={handleChange} />
            ) : currentQ ? (
              <QuestionStep question={currentQ} value={formData[currentQ.key]} onChange={(v) => handleChange(currentQ.key, v)} />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6 gap-4">
          <Button
            variant="neonOutline"
            size="lg"
            onClick={prev}
            disabled={step === 0}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </Button>

          {step < totalSteps - 1 ? (
            <Button
              variant="neon"
              size="lg"
              onClick={next}
              disabled={!canNext()}
              className="flex-1"
            >
              Suivant <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="neonGreen"
              size="lg"
              onClick={next}
              disabled={!canNext() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Envoi..." : "Rejoindre"} <Send className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionStep({ question, value, onChange }: { question: QuestionConfig; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-primary glow-text-purple mb-1">
        {question.label}
      </h2>
      <p className="text-muted-foreground text-sm mb-6 font-body">{question.subtitle}</p>

      {question.type === "select" && question.options ? (
        <div className="grid gap-3">
          {question.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-body font-semibold flex items-center gap-3 ${
                value === opt.value
                  ? "border-primary bg-primary/15 text-foreground glow-purple"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      ) : question.type === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className="w-full bg-input border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary focus:glow-purple transition-all resize-none"
        />
      ) : (
        <input
          type={question.type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full bg-input border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary transition-all text-lg"
        />
      )}
    </div>
  );
}

function AddressStep({ formData, onChange }: { formData: FormData; onChange: (key: keyof FormData, value: string) => void }) {
  const fields: { key: keyof FormData; label: string; placeholder: string }[] = [
    { key: "adresse_rue", label: "Rue", placeholder: "123 Rue du Dojo" },
    { key: "adresse_ville", label: "Ville", placeholder: "Tokyo" },
    { key: "adresse_code_postal", label: "Code Postal", placeholder: "75001" },
    { key: "adresse_pays", label: "Pays", placeholder: "France" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <MapPin className="w-6 h-6 text-secondary" />
        <h2 className="text-2xl md:text-3xl font-display text-primary glow-text-purple">
          Ton adresse
        </h2>
      </div>
      <p className="text-muted-foreground text-sm mb-6 font-body">
        Pour que l'on puisse t'envoyer tes récompenses de héros
      </p>
      <div className="grid gap-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-body font-semibold mb-1 block">
              {f.label}
            </label>
            <input
              type="text"
              value={formData[f.key]}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full bg-input border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
