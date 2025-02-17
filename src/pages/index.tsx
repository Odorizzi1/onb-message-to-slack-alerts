import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button,
  Container,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import { useState } from "react";

const formSchema = z.object({
  slackWebhookUrl: z
    .string()
    .url("URL inválida")
    .startsWith("https://hooks.slack.com", "Deve ser uma URL do Slack Webhook"),
  metabaseId: z.string().min(1, "MetabaseID é obrigatório"),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
});

const Index = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slackWebhookUrl: "",
      metabaseId: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      setSnackbarMessage("Evento criado com sucesso!");
      setSeverity("success");
      setOpenSnackbar(true);
      form.reset();
    } catch (error) {
      setSnackbarMessage("Erro ao criar evento. Tente novamente.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          elevation={3}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2
          }}
        >
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
              Criar Novo Evento
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Configure os detalhes do seu evento preenchendo o formulário abaixo
            </Typography>

            <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Slack Webhook URL"
                fullWidth
                {...form.register("slackWebhookUrl")}
                error={!!form.formState.errors.slackWebhookUrl}
                helperText={form.formState.errors.slackWebhookUrl?.message}
                placeholder="https://hooks.slack.com/services/..."
              />

              <TextField
                label="Metabase ID"
                fullWidth
                {...form.register("metabaseId")}
                error={!!form.formState.errors.metabaseId}
                helperText={form.formState.errors.metabaseId?.message}
                placeholder="Digite o ID do Metabase"
              />

              <TextField
                label="Mensagem"
                fullWidth
                multiline
                rows={4}
                {...form.register("message")}
                error={!!form.formState.errors.message}
                helperText={form.formState.errors.message?.message}
                placeholder="Digite a URL da sua consulta METABASE"
              />

              <Button 
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                Criar Evento
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Index;