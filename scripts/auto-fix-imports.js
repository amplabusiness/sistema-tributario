#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE AUTOMAÇÃO 100% IA - CORREÇÃO AUTOMÁTICA DE IMPORTS
 * Sistema Tributário 100% IA - Agente de Correção Automática
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AutoFixImports {
  constructor() {
    this.frontendPath = path.join(__dirname, '../frontend');
    this.componentsPath = path.join(this.frontendPath, 'src/components/ui');
    this.fixedFiles = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async fixButtonComponent() {
    this.log('🔧 Corrigindo componente Button...', 'info');
    
    const buttonPath = path.join(this.componentsPath, 'button.tsx');
    const buttonContent = `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`;

    try {
      fs.writeFileSync(buttonPath, buttonContent);
      this.fixedFiles.push('button.tsx');
      this.log('✅ Componente Button corrigido com sucesso!', 'success');
    } catch (error) {
      this.errors.push(`Erro ao corrigir Button: ${error.message}`);
      this.log(`❌ Erro ao corrigir Button: ${error.message}`, 'error');
    }
  }

  async fixBadgeComponent() {
    this.log('🔧 Corrigindo componente Badge...', 'info');
    
    const badgePath = path.join(this.componentsPath, 'badge.tsx');
    const badgeContent = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
`;

    try {
      fs.writeFileSync(badgePath, badgeContent);
      this.fixedFiles.push('badge.tsx');
      this.log('✅ Componente Badge corrigido com sucesso!', 'success');
    } catch (error) {
      this.errors.push(`Erro ao corrigir Badge: ${error.message}`);
      this.log(`❌ Erro ao corrigir Badge: ${error.message}`, 'error');
    }
  }

  async fixDashboardPage() {
    this.log('🔧 Corrigindo página do Dashboard...', 'info');
    
    const dashboardPath = path.join(this.frontendPath, 'src/app/(auth)/dashboard/page.tsx');
    
    // Ler o arquivo atual
    let content = fs.readFileSync(dashboardPath, 'utf8');
    
    // Corrigir o erro de inicialização circular
    content = content.replace(
      /const \[agents, setAgents\] = useState<AgentStatus\[\]>\(agents\);/g,
      'const [agents, setAgents] = useState<AgentStatus[]>([]);'
    );
    
    content = content.replace(
      /const \[alerts, setAlerts\] = useState<Alert\[\]>\(alerts\);/g,
      'const [alerts, setAlerts] = useState<Alert[]>([]);'
    );

    try {
      fs.writeFileSync(dashboardPath, content);
      this.fixedFiles.push('dashboard/page.tsx');
      this.log('✅ Página Dashboard corrigida com sucesso!', 'success');
    } catch (error) {
      this.errors.push(`Erro ao corrigir Dashboard: ${error.message}`);
      this.log(`❌ Erro ao corrigir Dashboard: ${error.message}`, 'error');
    }
  }

  async fixBackendPort() {
    this.log('🔧 Corrigindo porta do backend...', 'info');
    
    const backendIndexPath = path.join(__dirname, '../backend/src/index.ts');
    
    try {
      let content = fs.readFileSync(backendIndexPath, 'utf8');
      
      // Alterar porta de 3000 para 3001
      content = content.replace(
        /const PORT = process\.env\.PORT \|\| 3000;/g,
        'const PORT = process.env.PORT || 3001;'
      );
      
      fs.writeFileSync(backendIndexPath, content);
      this.fixedFiles.push('backend/src/index.ts');
      this.log('✅ Porta do backend alterada para 3001!', 'success');
    } catch (error) {
      this.errors.push(`Erro ao corrigir porta do backend: ${error.message}`);
      this.log(`❌ Erro ao corrigir porta do backend: ${error.message}`, 'error');
    }
  }

  async createUtilsFile() {
    this.log('🔧 Criando arquivo utils...', 'info');
    
    const utilsPath = path.join(this.frontendPath, 'src/lib/utils.ts');
    const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

    try {
      // Criar diretório se não existir
      const libDir = path.dirname(utilsPath);
      if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir, { recursive: true });
      }
      
      fs.writeFileSync(utilsPath, utilsContent);
      this.fixedFiles.push('lib/utils.ts');
      this.log('✅ Arquivo utils criado com sucesso!', 'success');
    } catch (error) {
      this.errors.push(`Erro ao criar utils: ${error.message}`);
      this.log(`❌ Erro ao criar utils: ${error.message}`, 'error');
    }
  }

  async installMissingDependencies() {
    this.log('📦 Instalando dependências faltantes...', 'info');
    
    const dependencies = [
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    ];

    try {
      const installCommand = `cd ${this.frontendPath} && npm install ${dependencies.join(' ')}`;
      execSync(installCommand, { stdio: 'inherit' });
      this.log('✅ Dependências instaladas com sucesso!', 'success');
    } catch (error) {
      this.errors.push(`Erro ao instalar dependências: ${error.message}`);
      this.log(`❌ Erro ao instalar dependências: ${error.message}`, 'error');
    }
  }

  async runHealthCheck() {
    this.log('🏥 Executando health check...', 'info');
    
    try {
      // Verificar se os arquivos foram criados
      const buttonExists = fs.existsSync(path.join(this.componentsPath, 'button.tsx'));
      const badgeExists = fs.existsSync(path.join(this.componentsPath, 'badge.tsx'));
      const utilsExists = fs.existsSync(path.join(this.frontendPath, 'src/lib/utils.ts'));
      
      if (buttonExists && badgeExists && utilsExists) {
        this.log('✅ Health check passou! Todos os arquivos estão corretos.', 'success');
        return true;
      } else {
        this.log('⚠️ Health check falhou! Alguns arquivos não foram criados.', 'warning');
        return false;
      }
    } catch (error) {
      this.log(`❌ Erro no health check: ${error.message}`, 'error');
      return false;
    }
  }

  async execute() {
    this.log('🚀 INICIANDO AUTOMAÇÃO 100% IA - CORREÇÃO DE IMPORTS', 'info');
    this.log('=' * 60, 'info');
    
    try {
      // 1. Corrigir componentes UI
      await this.fixButtonComponent();
      await this.fixBadgeComponent();
      
      // 2. Corrigir página do dashboard
      await this.fixDashboardPage();
      
      // 3. Corrigir porta do backend
      await this.fixBackendPort();
      
      // 4. Criar arquivo utils
      await this.createUtilsFile();
      
      // 5. Instalar dependências
      await this.installMissingDependencies();
      
      // 6. Health check
      const healthOk = await this.runHealthCheck();
      
      // Relatório final
      this.log('=' * 60, 'info');
      this.log('📊 RELATÓRIO FINAL DA AUTOMAÇÃO', 'info');
      this.log('=' * 60, 'info');
      
      this.log(`✅ Arquivos corrigidos: ${this.fixedFiles.length}`, 'success');
      this.fixedFiles.forEach(file => this.log(`  - ${file}`, 'success'));
      
      if (this.errors.length > 0) {
        this.log(`❌ Erros encontrados: ${this.errors.length}`, 'error');
        this.errors.forEach(error => this.log(`  - ${error}`, 'error'));
      }
      
      this.log(`🏥 Health Check: ${healthOk ? 'PASSOU' : 'FALHOU'}`, healthOk ? 'success' : 'error');
      
      if (healthOk && this.errors.length === 0) {
        this.log('🎉 AUTOMAÇÃO CONCLUÍDA COM SUCESSO!', 'success');
        this.log('🚀 Sistema pronto para execução!', 'success');
      } else {
        this.log('⚠️ Automação concluída com alguns problemas.', 'warning');
      }
      
    } catch (error) {
      this.log(`💥 Erro crítico na automação: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Executar automação
if (require.main === module) {
  const autoFix = new AutoFixImports();
  autoFix.execute();
}

module.exports = AutoFixImports; 