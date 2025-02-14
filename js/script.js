// Bongo Cat originally created by @StrayRogue and @DitzyFlama

const ID = "bongo-cat";
const s = (selector) => `#${ID} ${selector}`;
const notes = document.querySelectorAll(".note");

for (let note of notes) {
  note?.parentElement?.appendChild(note.cloneNode(true));
  note?.parentElement?.appendChild(note.cloneNode(true));
}

const music = { note: s(".music .note") };
const cat = {
  pawRight: {
    up: s(".paw-right .up"),
    down: s(".paw-right .down"),
  },
  pawLeft: {
    up: s(".paw-left .up"),
    down: s(".paw-left .down"),
  },
};

const style = getComputedStyle(document.documentElement);

const green = style.getPropertyValue("--green");
const pink = style.getPropertyValue("--pink");
const blue = style.getPropertyValue("--blue");
const orange = style.getPropertyValue("--orange");
const cyan = style.getPropertyValue("--cyan");

gsap.set(music.note, { scale: 0, autoAlpha: 1 });

const animatePawState = (selector) =>
  gsap.fromTo(
    selector,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.01,
      repeatDelay: 0.19,
      yoyo: true,
      repeat: -1,
    }
  );

const tl = gsap.timeline();

tl.add(animatePawState(cat.pawLeft.up), "start")
  .add(animatePawState(cat.pawRight.down), "start")
  .add(animatePawState(cat.pawLeft.down), "start+=0.19")
  .add(animatePawState(cat.pawRight.up), "start+=0.19")
  .timeScale(1.6);

gsap.fromTo(
  ".terminal-code line",
  {
    strokeDasharray: "100%",
    strokeDashoffset: "100%",
  },
  {
    strokeDashoffset: 0,
    duration: 0.1,
    stagger: 0.1,
    ease: "none",
    repeat: -1,
  }
);

const noteElFn = gsap.utils.pipe(gsap.utils.toArray, gsap.utils.shuffle);
const noteEls = noteElFn(music.note);

const numNotes = noteEls.length / 3;
const notesG1 = noteEls.splice(0, numNotes);
const notesG2 = noteEls.splice(0, numNotes);
const notesG3 = noteEls;

const colorizer = gsap.utils.random(
  [green, pink, blue, orange, cyan, "#a3a4ec", "#67b5c0", "#fd7c6e"],
  true
);
const rotator = gsap.utils.random(-50, 50, 1, true);
const dir = (amt) => `${gsap.utils.random(["-", "+"])}=${amt}`;

const animateNotes = (els) => {
  els.forEach((el) => {
    gsap.set(el, {
      stroke: colorizer(),
      rotation: rotator(),
      x: gsap.utils.random(-25, 25, 1),
    });
  });

  return gsap.fromTo(
    els,
    {
      autoAlpha: 1,
      y: 0,
      scale: 0,
    },
    {
      duration: 2,
      autoAlpha: 0,
      scale: 1,
      ease: "none",
      stagger: {
        from: "random",
        each: 0.5,
      },
      rotation: dir(gsap.utils.random(20, 30, 1)),
      x: dir(gsap.utils.random(40, 60, 1)),
      y: gsap.utils.random(-200, -220, 1),
      onComplete: () => animateNotes(els),
    }
  );
};

tl.add(animateNotes(notesG1))
  .add(animateNotes(notesG2), ">0.05")
  .add(animateNotes(notesG3), ">0.25");

const terminal = {
  input: document.getElementById('terminal-input'),
  window: document.getElementById('terminal-window'),
  history: [],
  historyIndex: -1,

  commands: {
    help: () => ({
      type: 'system',
      content: `Available commands:
- about: Show more info about me :3
- skills: See my skillz.
- contact: Some relevant links for you.
- clear: Clear terminal
- cat: Hide the catto. Or show it.
- github: Open my GitHub profile (I hate frontend)
- ascii: Show a cool ASCII art
- date: Show current date and time`
    }),
    about: () => ({
      type: 'success',
      content: "Hey there! 👋 I'm Vivian, a DevOps engineer. As you can tell, I hate frontend. I'm 27 years old, based in Bulgaria. Let my work speak for itself :3 If you'd like to get in touch, check the contact command (:"
    }),
    skills: () => ({
      type: 'success',
      content: `Technical Skills:
• Infrastructure & Cloud:
  - Virtualization & Hypervisors:
    * VMware Suite (vSphere, ESXi, vCenter, vSAN, NSX)
    * Microsoft Hyper-V & System Center
    * KVM/QEMU, Xen, Proxmox
    * Virtual Desktop Infrastructure (VDI)
    * P2V Migration & Capacity Planning

  - Cloud Platforms & Services:
    * AWS (EC2, S3, RDS, Lambda, ECS, Route53, CloudFront)
    * Azure (VM, AKS, Functions, Storage, AD)
    * GCP (Compute Engine, GKE, Cloud Storage)
    * Private/Hybrid Cloud Architecture
    * Cloud Security & Compliance

  - Infrastructure as Code & Automation:
    * Terraform & Terragrunt
    * AWS CloudFormation
    * Azure Resource Manager (ARM)
    * Pulumi
    * Custom Automation Scripts

  - Configuration Management:
    * Ansible (Playbooks, Roles, AWX)
    * Puppet (Enterprise & Open Source)
    * Chef (Cookbooks, Knife)
    * Salt
    * Custom Configuration Scripts

  - Storage & Backup Solutions:
    * SAN/NAS Architecture
    * Data Replication & DR
    * Backup Solutions (Veeam, Commvault)
    * Storage Optimization
    * Disaster Recovery Planning

• Containerization & Orchestration:
  - Container Technologies:
    * Docker (Multi-stage builds, Docker Compose)
    * Podman, Buildah, Skopeo
    * Container Security & Hardening
    * Custom Base Image Creation
    * Image Registry Management

  - Orchestration Platforms:
    * Kubernetes (K8s administration, RBAC, NetworkPolicies)
    * OpenShift (Routes, Templates, BuildConfigs)
    * Amazon EKS, Azure AKS, Google GKE
    * Rancher, K3s
    * Service Mesh (Istio, Linkerd)

  - Microservices Architecture:
    * Service Discovery
    * API Gateway Implementation
    * Load Balancing & Scaling
    * Circuit Breaking & Failover
    * Distributed Tracing

• CI/CD & DevOps Practices:
  - Pipeline Management:
    * Jenkins (Pipelines, Shared Libraries)
    * GitLab CI/CD
    * GitHub Actions
    * Azure DevOps
    * ArgoCD, Flux

  - Build & Release:
    * Maven, Gradle, npm
    * Artifact Management (Nexus, Artifactory)
    * Release Strategies
    * Blue-Green Deployments
    * Canary Releases

  - Testing & Quality:
    * Unit Testing Frameworks
    * Integration Testing
    * Performance Testing (JMeter, K6)
    * Security Scanning
    * Code Quality Tools

• Monitoring & Observability:
  - Monitoring Platforms:
    * Prometheus & Grafana
    * ELK Stack (Elasticsearch, Logstash, Kibana)
    * Datadog
    * Nagios, Zabbix
    * Custom Monitoring Solutions

  - Log Management:
    * Centralized Logging
    * Log Analysis & Parsing
    * Log Retention Policies
    * Audit Logging
    * Log Security

  - Application Performance:
    * APM Tools (New Relic, Dynatrace)
    * Metrics Collection
    * Performance Optimization
    * Resource Utilization
    * Capacity Planning
    
  • Security & Compliance:
  - Infrastructure Security:
    * Firewall Configuration & Management
    * VPN & Network Security
    * SSL/TLS Management
    * Security Groups & ACLs
    * Zero Trust Architecture

  - Identity & Access:
    * LDAP/Active Directory
    * OAuth/OIDC
    * SAML Integration
    * Role-Based Access Control
    * SSO Implementation

  - Security Operations:
    * Vulnerability Scanning
    * Penetration Testing
    * Security Patching
    * Incident Response
    * Security Auditing

• Systems Administration:
  - Linux Administration:
    * RHEL/CentOS/Rocky Linux
    * Ubuntu/Debian
    * Package Management
    * System Hardening
    * Performance Tuning

  - Windows Administration:
    * Windows Server Management
    * Active Directory
    * Group Policy
    * PowerShell Automation
    * Windows Updates Management

  - Network Administration:
    * TCP/IP, DNS, DHCP
    * Load Balancers (F5, HAProxy)
    * SDN & Network Automation
    * WAN/LAN Architecture
    * Network Troubleshooting

  - Automation & Scripting:
    * Bash/Shell Scripting
    * PowerShell
    * Python
    * Ruby
    * Infrastructure Automation

• Version Control & Collaboration:
  - Version Control:
    * Git (Advanced Workflows)
    * GitHub Enterprise
    * GitLab Administration
    * Bitbucket
    * Code Review Practices

  - Documentation:
    * Technical Documentation
    * API Documentation
    * Runbooks & Playbooks
    * Knowledge Base Management
    * Documentation as Code

  - Project Management:
    * Agile/Scrum Methodologies
    * Kanban
    * JIRA Administration
    * Confluence
    * Team Collaboration Tools`
    }),
    vyley: () => {
      window.location.href = 'valentine.html';
      return {
          type: 'success',
          content: 'Opening Valentine\'s message... ❤️'
      };
    },
    contact: () => ({
      type: 'success',
      content: `You can find me here :3
• GitHub: https://github.com/vivi4n
• Ko-Fi: https://ko-fi.com/vivi4n
• Discord: viv4n`
    }),
    cat: () => {
      const container = document.querySelector('.container');
      container.style.display = container.style.display === 'none' ? 'flex' : 'none';
      return {
        type: 'success',
        content: `Bongo Cat ${container.style.display === 'none' ? 'is taking a break 😴' : 'is back! 🎵'}`
      };
    },
    clear: () => {
      terminal.window.innerHTML = '';
      return null;
    },
    date: () => ({
      type: 'system',
      content: new Date().toLocaleString()
    }),
    ascii: () => ({
      type: 'success',
      content: `
    /\\___/\\
   (  o o  )
   (  =^=  ) 
    (____)`
    }),
    github: () => {
      window.open('https://github.com/vivi4n', '_blank');
      return {
        type: 'system',
        content: 'Opening GitHub profile...'
      };
    }
  },

  init() {
    this.addLine('Hi there, welcome to my little portfolio 👋', 'system');
    this.addLine('Type "help" to see available commands', 'system');
    
    this.input.addEventListener('keydown', this.handleInput.bind(this));
    this.input.addEventListener('keyup', this.handleKeyUp.bind(this));
  },

  addLine(content, type = 'default') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = content;
    this.window.appendChild(line);
    this.window.scrollTop = this.window.scrollHeight;
  },

  handleInput(e) {
    if (e.key === 'Enter') {
      const command = this.input.value.trim().toLowerCase();
      
      if (command) {
        this.addLine(`❯ ${command}`);
        this.history.push(command);
        this.historyIndex = this.history.length;

        if (this.commands[command]) {
          const result = this.commands[command]();
          if (result) {
            this.addLine(result.content, result.type);
          }
        } else {
          this.addLine(`Command not found: ${command}. Did you make a typo? "help" to view them all.`, 'error');
        }
      }
      
      this.input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    }
  },

  handleKeyUp(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  terminal.init();
});