import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo2026.png";
import { ChevronLeft, ChevronRight, Send, Mail, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface FormData {
  email: string;
  age: string;
  niveau_sportif: string;
  objectif_fitness: string;
  avatar_motivation: string;
  presentation_seances: string;
  recompense_preferee: string;
  personnalisation_avatar: string[];
  visualisation_stats: string;
  ambiance_visuelle: string;
  leaderboard: string;
  creation_defis: string;
}

const initialData: FormData = {
  email: "",
  age: "",
  niveau_sportif: "",
  objectif_fitness: "",
  avatar_motivation: "",
  presentation_seances: "",
  recompense_preferee: "",
  personnalisation_avatar: [],
  visualisation_stats: "",
  ambiance_visuelle: "",
  leaderboard: "",
  creation_defis: "",
};

type QuestionConfig = {
  key: keyof Omit<FormData, "email" | "personnalisation_avatar">;
  label: string;
  subtitle: string;
  options: { value: string; label: string; image?: string }[];
};

type MultiQuestionConfig = {
  key: "personnalisation_avatar";
  label: string;
  subtitle: string;
  maxSelect: number;
  options: { value: string; label: string; image?: string }[];
};

type AnyQuestion = (QuestionConfig | MultiQuestionConfig) & { multi?: boolean };

const questions: AnyQuestion[] = [
  {
    key: "age",
    label: "Quel est votre âge ?",
    subtitle: "Section 1 — Profil Sportif",
    options: [
      { value: "moins_18", label: "Moins de 18 ans", image: "/fitnessAnime/question 1/-18.jpg" },
      { value: "18_24", label: "18 - 24 ans", image: "/fitnessAnime/question 1/18-24.jpg" },
      { value: "25_34", label: "25 - 34 ans", image: "/fitnessAnime/question 1/25-34.jpg" },
      { value: "35_plus", label: "35 ans et plus", image: "/fitnessAnime/question 1/35et+.jpg" },
    ],
  },
  {
    key: "niveau_sportif",
    label: "Comment décririez-vous votre niveau de fitness actuel ?",
    subtitle: "Section 1 — Profil Sportif",
    options: [
      { value: "debutant", label: "Débutant (Je commence ou reprends doucement)", image: "/fitnessAnime/question 2/débutant.jpg" },
      { value: "intermediaire", label: "Intermédiaire (Je m'entraîne occasionnellement)", image: "/fitnessAnime/question 2/intermédiaire.jpg" },
      { value: "avance", label: "Avancé (Je m'entraîne très régulièrement)", image: "/fitnessAnime/question 2/avancé.jpg" },
    ],
  },
  {
    key: "objectif_fitness",
    label: "Quel est votre objectif physique principal ?",
    subtitle: "Section 2 — Objectifs",
    options: [
      { value: "masse", label: "Prise de masse / Force", image: "/fitnessAnime/question3/masse_force.png" },
      { value: "perte_poids", label: "Perte de poids / Sèche", image: "/fitnessAnime/question3/sèche.jpg" },
      { value: "endurance", label: "Endurance / Cardio", image: "/fitnessAnime/question3/endurance_cardio.jpg" },
      { value: "maintien", label: "Maintien / Santé générale", image: "/fitnessAnime/question3/méditation.jpg" },
    ],
  },
  {
    key: "avatar_motivation",
    label: "L'idée de faire évoluer un Avatar 3D virtuel grâce à vos vraies séances de sport vous motive-t-elle ?",
    subtitle: "Section 3 — L'Expérience Fitness Anim",
    options: [
      { value: "oui", label: "Oui, carrément ! C'est exactement ce qu'il me faut.", image: "/fitnessAnime/question4/carrément.jpg" },
      { value: "pourquoi_pas", label: "Pourquoi pas, à tester.", image: "/fitnessAnime/question4/mouai.jpg" },
      { value: "non", label: "Non, je préfère séparer le sport et les jeux.", image: "/fitnessAnime/question4/non.jpg" },
    ],
  },
  {
    key: "presentation_seances",
    label: "Comment préférez-vous que vos séances soient présentées ?",
    subtitle: "Section 3 — L'Expérience Fitness Anim",
    options: [
      { value: "missions", label: 'Comme des "Missions" allant du Rang D (Facile) au Rang S (Extrême) avec des sceaux à débloquer.', image: "/fitnessAnime/question 5/Mission.jpg" },
      { value: "classique", label: "Comme des séances de sport classiques (Débutant, Intermédiaire, etc.).", image: "/fitnessAnime/question 5/séances.jpg" },
    ],
  },
  {
    key: "recompense_preferee",
    label: "À la fin d'une séance (Fin de Mission), quelle récompense vous donne le plus de satisfaction ?",
    subtitle: "Section 3 — L'Expérience Fitness Anim",
    options: [
      { value: "xp", label: "Voir ma jauge d'XP se remplir et passer au niveau supérieur.", image: "/fitnessAnime/question 6/exp.jpg" },
      { value: "or_gemmes", label: "Gagner de l'Or/Gemmes pour acheter des équipements.", image: "/fitnessAnime/question 6/or.jpg" },
      { value: "badges", label: "Obtenir des Badges de réussite.", image: "/fitnessAnime/question 6/badge.jpg" },
    ],
  },
  {
    key: "personnalisation_avatar",
    label: "Qu'est-ce qui est le plus important pour la personnalisation de votre Avatar 3D ?",
    subtitle: "Section 4 — Personnalisation (2 choix max)",
    maxSelect: 2,
    multi: true,
    options: [
      { value: "vetements", label: "Les vêtements et armures.", image: "/fitnessAnime/question 7/armur.jpg" },
      { value: "effets", label: "Les effets visuels (ex: une Aura lumineuse qui l'entoure).", image: "/fitnessAnime/question 7/aura.jpg" },
      { value: "ressemblance", label: "La ressemblance physique avec moi.", image: "/fitnessAnime/question 7/visuel.jpg" },
      { value: "evolution", label: "Qu'il devienne visiblement plus musclé/fit au fil de mes entraînements réels.", image: "/fitnessAnime/question 7/+musclé.jpg" },
    ],
  },
  {
    key: "visualisation_stats",
    label: "Comment préférez-vous visualiser vos statistiques de progression ?",
    subtitle: "Section 4 — Personnalisation",
    options: [
      { value: "constellation", label: 'Via une "Constellation de Compétences" (Graphique Radar : Force, Agilité, etc.).' },
      { value: "courbes", label: "Via des graphiques en courbes classiques (Poids, Calories)." },
      { value: "avatar", label: "Uniquement via l'apparence de mon avatar." },
    ],
  },
  {
    key: "ambiance_visuelle",
    label: "Quelle ambiance visuelle vous attire le plus pour cette application ?",
    subtitle: "Section 5 — Interface & Communauté",
    options: [
      { value: "sombre", label: "Mode Sombre (Gamer/Cyberpunk) avec des lignes lumineuses Néon (Violet et Vert).", image: "/fitnessAnime/questio 9/cyberpunk.jpg" },
      { value: "clair", label: "Mode Clair, épuré et minimaliste." },
      { value: "choix", label: "Je veux pouvoir choisir entre les deux." },
    ],
  },
  {
    key: "leaderboard",
    label: 'Êtes-vous intéressé(e) par un classement "Top Héros" (Leaderboard) ?',
    subtitle: "Section 5 — Interface & Communauté",
    options: [
      { value: "oui_mondial", label: "Oui, j'adore la compétition mondiale !", image: "/fitnessAnime/question 10/compétition.jpg" },
      { value: "oui_amis", label: "Oui, mais uniquement avec ma liste d'amis." },
      { value: "non", label: "Non, je joue et m'entraîne uniquement en solo.", image: "/fitnessAnime/question 10/solo.jpg" },
    ],
  },
  {
    key: "creation_defis",
    label: 'La fonctionnalité de créer vos propres défis ("Créer mon propre Contract") pour les partager à la communauté vous intéresse-t-elle ?',
    subtitle: "Section 5 — Interface & Communauté",
    options: [
      { value: "beaucoup", label: "Beaucoup, j'aime créer des entraînements." },
      { value: "un_peu", label: "Un peu, je testerai ceux des autres surtout." },
      { value: "pas_du_tout", label: "Pas du tout." },
    ],
  },
];

export default function FitnessAnimForm() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [emailEntered, setEmailEntered] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = questions.length;

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2.5 rounded-xl glass-surface hover:scale-110 transition-transform"
      aria-label="Basculer le thème"
    >
      {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-primary" />}
    </button>
  );

  const currentQ = questions[step];

  const canNext = () => {
    if (currentQ.multi) {
      return (formData.personnalisation_avatar as string[]).length > 0;
    }
    return !!formData[currentQ.key as keyof FormData];
  };

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiToggle = (value: string) => {
    setFormData((prev) => {
      const current = prev.personnalisation_avatar;
      if (current.includes(value)) {
        return { ...prev, personnalisation_avatar: current.filter((v) => v !== value) };
      }
      if (current.length >= 2) return prev;
      return { ...prev, personnalisation_avatar: [...current, value] };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("guest_responses").insert({
        email: formData.email,
        pseudo: "Héros",
        age: formData.age || null,
        niveau_sportif: formData.niveau_sportif || null,
        objectif_fitness: formData.objectif_fitness || null,
        avatar_motivation: formData.avatar_motivation || null,
        presentation_seances: formData.presentation_seances || null,
        recompense_preferee: formData.recompense_preferee || null,
        personnalisation_avatar: formData.personnalisation_avatar.join(", ") || null,
        visualisation_stats: formData.visualisation_stats || null,
        ambiance_visuelle: formData.ambiance_visuelle || null,
        leaderboard: formData.leaderboard || null,
        creation_defis: formData.creation_defis || null,
      } as any);
      if (error) throw error;
      setIsComplete(true);
      toast.success("Merci pour votre participation !");
    } catch (err: any) {
      toast.error("Erreur : " + (err.message || "Réessaie plus tard"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else handleSubmit();
  };
  const prev = () => step > 0 && setStep((s) => s - 1);

  const progress = ((step + 1) / totalSteps) * 100;

  // ── Email Popup ──
  if (!emailEntered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <ThemeToggle />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-surface rounded-2xl p-8 w-full max-w-md text-center z-10"
        >
          <motion.img
            src={logo}
            alt="FitnessAnim"
            className="w-24 h-24 mx-auto mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <h1 className="text-3xl md:text-4xl font-display glow-text-purple text-primary mb-2">
            Bienvenue, Héros !
          </h1>
          <p className="text-muted-foreground font-body text-sm mb-6">
            Entre ton email pour commencer le questionnaire et rejoindre l'aventure Fitness Anim.
          </p>
          <div className="flex items-center gap-2 bg-input border-2 border-border rounded-xl px-4 py-3 mb-4 focus-within:border-primary transition-all">
            <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="votre@email.com"
              className="bg-transparent w-full text-foreground placeholder:text-muted-foreground font-body focus:outline-none text-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.email.includes("@")) {
                  setEmailEntered(true);
                }
              }}
            />
          </div>
          <Button
            variant="neon"
            size="lg"
            className="w-full"
            disabled={!formData.email.includes("@")}
            onClick={() => setEmailEntered(true)}
          >
            Commencer <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Complete Screen ──
  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ThemeToggle />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.img
            src={logo}
            alt="FitnessAnim"
            className="w-32 h-32 mx-auto mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <h1 className="text-4xl font-display glow-text-purple text-primary mb-4">
            Merci, Héros !
          </h1>
          <p className="text-muted-foreground text-lg font-body">
            Tes réponses ont été enregistrées. L'aventure Fitness Anim commence bientôt !
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Main Form ──
    return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <ThemeToggle />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center mb-6"
        >
          <img src={logo} alt="FitnessAnim" className="w-16 h-16" />
        </motion.div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground font-body font-semibold uppercase tracking-wider">
              Question {step + 1} / {totalSteps}
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

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-surface rounded-2xl p-6 md:p-8"
          >
            <p className="text-xs uppercase tracking-wider text-secondary font-body font-semibold mb-1">
              {currentQ.subtitle}
            </p>
            <h2 className="text-xl md:text-2xl font-display text-primary glow-text-purple mb-5 leading-tight">
              {currentQ.label}
            </h2>

            <div className={`grid gap-3 ${currentQ.options.some((o: any) => o.image) ? 'grid-cols-1 sm:grid-cols-2' : ''}`}>
              {currentQ.options.map((opt) => {
                const isMulti = !!(currentQ as any).multi;
                const isSelected = isMulti
                  ? formData.personnalisation_avatar.includes(opt.value)
                  : formData[currentQ.key as keyof FormData] === opt.value;
                const hasImage = !!(opt as any).image;

                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      isMulti
                        ? handleMultiToggle(opt.value)
                        : handleChange(currentQ.key as keyof FormData, opt.value)
                    }
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-body text-sm font-semibold flex items-center gap-3 relative overflow-hidden group ${
                      isSelected
                        ? "border-primary bg-primary/20 text-foreground glow-purple"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                    } ${hasImage ? "min-h-[140px] items-end pb-4" : ""}`}
                  >
                    {hasImage && (
                      <>
                        <div 
                          className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 ${isSelected ? "opacity-50" : "opacity-30 group-hover:opacity-40"}`}
                          style={{ backgroundImage: `url('${encodeURI((opt as any).image)}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                      </>
                    )}
                    
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-primary-foreground" />}
                      </span>
                      <span className={`${hasImage ? "text-foreground drop-shadow-md text-base" : ""}`}>
                        {opt.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6 gap-4">
          <Button variant="neonOutline" size="lg" onClick={prev} disabled={step === 0} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </Button>

          {step < totalSteps - 1 ? (
            <Button variant="neon" size="lg" onClick={next} disabled={!canNext()} className="flex-1">
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
              {isSubmitting ? "Envoi..." : "Envoyer"} <Send className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
