# Demo Projects Specifications

## Overview
Two live demo projects to showcase capabilities: CYBERSTORE (e-commerce) and WORKFLOW_AI (SaaS).

---

## Project 1: CYBERSTORE

### Concept
Cyberpunk-themed e-commerce store demonstrating AI-powered shopping experience.

### Core Features

#### 1. Product Catalog
- 15-20 fictional cyberpunk products (tech gadgets, wearables, software)
- Categories: Neural Implants, Cyber Gear, AI Software, Security Tools
- High-quality product images (use AI-generated or free stock)
- Detailed product descriptions with specs

#### 2. AI Product Recommendations
- Gemini API analyzes user browsing behavior
- "You might also like..." based on viewed products
- Smart search with natural language ("show me something for hacking")
- AI shopping assistant in chat widget

#### 3. Shopping Cart & Checkout
- Add to cart functionality
- Cart persistence (localStorage)
- Stripe test mode integration
- Guest checkout (no account required)
- Order confirmation page

#### 4. Admin Dashboard
- Product management (CRUD)
- Order tracking
- Sales analytics
- Inventory management
- Protected with simple auth

#### 5. Additional Features
- Product filtering (price, category, rating)
- Search with autocomplete
- Wishlist functionality
- Product reviews (mock data)
- Responsive design

### Tech Stack
```
Frontend: Next.js 14, TypeScript, Tailwind CSS
Backend: Next.js API Routes
Database: Vercel Postgres (products, orders)
Payment: Stripe (test mode)
AI: Google Gemini API (recommendations, search)
Auth: NextAuth.js (admin only)
Deployment: Vercel
```

### Database Schema

```sql
-- Products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  stripe_payment_id VARCHAR(255),
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews (optional)
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  author_name VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Sample Products

**1. NeuroLink X1 Implant**
- Category: Neural Implants
- Price: $2,499
- Description: Direct brain-computer interface with 10TB storage and quantum encryption

**2. Cyber Vision Goggles**
- Category: Cyber Gear
- Price: $899
- Description: AR/VR hybrid with thermal vision and facial recognition

**3. Ghost Protocol VPN**
- Category: AI Software
- Price: $49/month
- Description: Military-grade encryption with AI-powered threat detection

**4. Neon Jacket v2.0**
- Category: Cyber Gear
- Price: $599
- Description: Smart fabric with programmable LED patterns and climate control

**5. AI Companion Bot**
- Category: AI Software
- Price: $1,299
- Description: Personal AI assistant with emotional intelligence and task automation

*(Add 10-15 more similar products)*

### AI Features Implementation

#### Smart Search
```typescript
// app/api/search/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const { query } = await req.json();
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompt = `Given this search query: "${query}"
  
  Available product categories: Neural Implants, Cyber Gear, AI Software, Security Tools
  
  Return relevant category and keywords as JSON:
  { "category": "...", "keywords": ["...", "..."] }`;
  
  const result = await model.generateContent(prompt);
  const response = JSON.parse(result.response.text());
  
  // Search products using extracted keywords
  const products = await searchProducts(response.keywords, response.category);
  
  return Response.json({ products });
}
```

#### Product Recommendations
```typescript
// app/api/recommendations/route.ts
export async function POST(req: Request) {
  const { productId, viewedProducts } = await req.json();
  
  const currentProduct = await getProduct(productId);
  const viewed = await getProducts(viewedProducts);
  
  const prompt = `User is viewing: ${currentProduct.name} (${currentProduct.category})
  
  Previously viewed: ${viewed.map(p => p.name).join(', ')}
  
  Available products: ${allProducts.map(p => `${p.name} (${p.category})`).join(', ')}
  
  Recommend 4 products that would interest this user. Return product IDs as JSON array.`;
  
  const result = await model.generateContent(prompt);
  const recommendedIds = JSON.parse(result.response.text());
  
  const recommendations = await getProducts(recommendedIds);
  
  return Response.json({ recommendations });
}
```

### Pages Structure

```
/cyberstore
  / - Homepage with featured products
  /products - All products grid
  /products/[slug] - Product detail page
  /cart - Shopping cart
  /checkout - Checkout form
  /success - Order confirmation
  /admin - Admin dashboard (protected)
  /admin/products - Product management
  /admin/orders - Order management
```

### Key UI Components

**Product Card:**
```tsx
<div className="group relative bg-bg-card border border-neon-cyan/20 rounded-lg overflow-hidden hover:border-neon-cyan/50 transition-all">
  <div className="aspect-square relative">
    <Image src={product.image} alt={product.name} fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-neon-cyan text-black font-mono font-bold">
        ADD TO CART
      </button>
    </div>
  </div>
  <div className="p-4">
    <h3 className="font-bold text-lg text-neon-cyan">{product.name}</h3>
    <p className="text-sm text-text-muted mt-1">{product.category}</p>
    <div className="flex justify-between items-center mt-3">
      <span className="text-xl font-bold text-neon-magenta">${product.price}</span>
      <span className="text-sm text-text-secondary">⭐ {product.rating}</span>
    </div>
  </div>
</div>
```

### Deployment
- Domain: `cyberstore.aidevdanyal.com` (subdomain)
- Or: `aidevdanyal.com/cyberstore` (subpath)
- Environment variables: Stripe keys, Gemini API key, database URL

---

## Project 2: WORKFLOW_AI

### Concept
SaaS platform for AI-powered workflow automation and task management.

### Core Features

#### 1. Dashboard
- Overview of active workflows
- Task completion metrics
- Recent activity feed
- Quick actions

#### 2. Workflow Builder
- Visual drag-and-drop interface
- Pre-built workflow templates
- Custom workflow creation
- Trigger configuration (time-based, event-based)

#### 3. AI Task Assistant
- Natural language task creation
- Smart task prioritization
- Automated task suggestions
- Deadline predictions

#### 4. Team Collaboration
- Shared workspaces
- Task assignment
- Comments and mentions
- Real-time updates

#### 5. Integrations (Mock)
- Slack notifications
- Email automation
- Calendar sync
- Webhook support

### Tech Stack
```
Frontend: Next.js 14, TypeScript, Tailwind CSS, React Flow (workflow builder)
Backend: Next.js API Routes
Database: Vercel Postgres (users, workflows, tasks)
AI: Google Gemini API (task analysis, suggestions)
Auth: NextAuth.js (email/password)
Real-time: Pusher or Socket.io
Deployment: Vercel
```

### Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces
CREATE TABLE workspaces (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workflows
CREATE TABLE workflows (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER REFERENCES workspaces(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(50), -- 'manual', 'schedule', 'webhook'
  trigger_config JSONB,
  nodes JSONB NOT NULL, -- workflow graph data
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER REFERENCES workspaces(id),
  workflow_id INTEGER REFERENCES workflows(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'in_progress', 'done'
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  assigned_to INTEGER REFERENCES users(id),
  due_date TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Activity Log
CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER REFERENCES workspaces(id),
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50), -- 'task', 'workflow', 'workspace'
  entity_id INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Workflow Templates

**1. Daily Standup Reminder**
- Trigger: Every weekday at 9 AM
- Action: Send Slack message to team
- AI: Summarize yesterday's completed tasks

**2. Lead Qualification**
- Trigger: New form submission
- Action: Analyze lead data with AI
- Action: Assign to sales rep based on score
- Action: Send welcome email

**3. Content Publishing**
- Trigger: Manual
- Action: Check content quality with AI
- Action: Schedule social media posts
- Action: Notify team members

**4. Bug Triage**
- Trigger: New GitHub issue
- Action: AI categorizes severity
- Action: Assign to relevant developer
- Action: Create task in workspace

**5. Weekly Report**
- Trigger: Every Friday at 5 PM
- Action: AI generates summary of week's tasks
- Action: Email report to stakeholders

### AI Features Implementation

#### Natural Language Task Creation
```typescript
// app/api/tasks/create-from-text/route.ts
export async function POST(req: Request) {
  const { text, workspaceId } = await req.json();
  
  const prompt = `Parse this task request and extract structured data:
  
  "${text}"
  
  Return JSON:
  {
    "title": "...",
    "description": "...",
    "priority": "low|medium|high|urgent",
    "dueDate": "YYYY-MM-DD or null",
    "assignee": "name or null"
  }`;
  
  const result = await model.generateContent(prompt);
  const taskData = JSON.parse(result.response.text());
  
  // Create task in database
  const task = await createTask({
    ...taskData,
    workspaceId,
  });
  
  return Response.json({ task });
}
```

#### Smart Task Prioritization
```typescript
// app/api/tasks/prioritize/route.ts
export async function POST(req: Request) {
  const { tasks } = await req.json();
  
  const prompt = `Given these tasks, suggest priority order based on urgency, dependencies, and impact:
  
  ${tasks.map((t, i) => `${i + 1}. ${t.title} (due: ${t.dueDate || 'none'})`).join('\n')}
  
  Return task IDs in priority order as JSON array.`;
  
  const result = await model.generateContent(prompt);
  const prioritizedIds = JSON.parse(result.response.text());
  
  return Response.json({ prioritizedIds });
}
```

#### Workflow Suggestions
```typescript
// app/api/workflows/suggest/route.ts
export async function POST(req: Request) {
  const { workspaceActivity } = await req.json();
  
  const prompt = `Based on this workspace activity, suggest 3 workflow automations that would save time:
  
  Recent tasks: ${workspaceActivity.recentTasks.join(', ')}
  Common patterns: ${workspaceActivity.patterns.join(', ')}
  
  Return JSON array of suggestions:
  [
    {
      "name": "...",
      "description": "...",
      "estimatedTimeSaved": "X hours/week"
    }
  ]`;
  
  const result = await model.generateContent(prompt);
  const suggestions = JSON.parse(result.response.text());
  
  return Response.json({ suggestions });
}
```

### Pages Structure

```
/workflow-ai
  / - Landing page (if not logged in) or Dashboard (if logged in)
  /login - Login page
  /signup - Signup page
  /dashboard - Main dashboard
  /workflows - Workflow list
  /workflows/new - Workflow builder
  /workflows/[id] - Workflow detail/edit
  /tasks - Task list
  /tasks/[id] - Task detail
  /team - Team members
  /settings - Workspace settings
```

### Key UI Components

**Dashboard Stats Card:**
```tsx
<div className="bg-bg-card border border-neon-cyan/20 rounded-lg p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-text-muted text-sm font-mono">ACTIVE WORKFLOWS</p>
      <p className="text-4xl font-bold text-neon-cyan mt-2">12</p>
      <p className="text-text-secondary text-sm mt-1">↑ 3 from last week</p>
    </div>
    <div className="w-16 h-16 bg-neon-cyan/10 rounded-full flex items-center justify-center">
      <span className="text-3xl">⚡</span>
    </div>
  </div>
</div>
```

**Task Card:**
```tsx
<div className="bg-bg-card border border-neon-cyan/20 rounded-lg p-4 hover:border-neon-cyan/50 transition-all cursor-pointer">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs font-mono rounded ${
          task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
          task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {task.priority.toUpperCase()}
        </span>
        <span className="text-xs text-text-muted">{task.workflow?.name}</span>
      </div>
      <h3 className="font-semibold text-white mt-2">{task.title}</h3>
      <p className="text-sm text-text-muted mt-1">{task.description}</p>
      <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
        <span>👤 {task.assignee?.name || 'Unassigned'}</span>
        <span>📅 {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}</span>
      </div>
    </div>
    <button className="text-text-muted hover:text-neon-cyan">
      <span className="text-xl">⋮</span>
    </button>
  </div>
</div>
```

**Workflow Builder (React Flow):**
```tsx
import ReactFlow, { Background, Controls } from 'reactflow';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  return (
    <div className="h-screen bg-bg-primary">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background color="#00f0ff" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

### Demo Data
- 1 demo workspace: "Acme Corp"
- 3 demo users: Admin, Developer, Designer
- 5 pre-built workflows (from templates above)
- 20 sample tasks in various states
- Activity log with 50+ entries

### Authentication
- Email/password signup
- Demo account: `demo@workflow-ai.com` / `demo123`
- Session management with NextAuth.js
- Protected routes

### Deployment
- Domain: `workflow-ai.aidevdanyal.com` (subdomain)
- Or: `aidevdanyal.com/workflow-ai` (subpath)
- Environment variables: Gemini API key, database URL, NextAuth secret

---

## Shared Implementation Notes

### Both Projects Should Have:
- Cyberpunk design system (from design-system.md)
- Responsive mobile design
- Loading states and skeletons
- Error handling
- Toast notifications
- SEO optimization
- Analytics tracking
- "Built by Danyal" footer with link to main portfolio

### Development Timeline
- **Week 1:** CYBERSTORE - Setup, products, cart
- **Week 2:** CYBERSTORE - Checkout, admin, AI features
- **Week 3:** WORKFLOW_AI - Setup, auth, dashboard, tasks
- **Week 4:** WORKFLOW_AI - Workflows, AI features, polish both

### Testing Checklist
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] AI features work (with rate limiting)
- [ ] Forms validate properly
- [ ] Error states handled
- [ ] Loading states smooth
- [ ] Database operations work
- [ ] Authentication secure
- [ ] Payment flow (Stripe test mode)
- [ ] Cross-browser compatible
- [ ] Lighthouse score 90+
- [ ] No console errors

### Promotion Strategy
- Link from main portfolio
- GitHub repos with good READMEs
- Demo video/GIF on portfolio
- Blog post about building them
- Share on Twitter/LinkedIn
- Add to resume/CV
