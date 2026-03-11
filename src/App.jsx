import React, { useState, useEffect } from 'react';
import { 
  Home, Box, Users, ShoppingCart, AlertCircle, FileText, Wrench, 
  Calendar, LogOut, CheckCircle, XCircle, Search, Plus, Edit2, 
  Trash2, Image as ImageIcon, Bell, ArrowRight, Clock, Star, 
  Upload, Download, ChevronRight, Eye
} from 'lucide-react';

// --- MOCK DATABASE ---
const initialUsers = [
  { id: 'U1', name: 'Admin Principal', ci: '1234567', phone: '70000000', email: 'admin@ballet.com', password: 'password123', role: 'Admin', status: 'Activo', lastLogin: 'Hoy 10:30' },
  { id: 'U2', name: 'Ana Maria', ci: '8765432', phone: '71111111', email: 'ana@ballet.com', password: 'password123', role: 'Bailarín', status: 'Activo', lastLogin: 'Hoy 09:15' },
  { id: 'U3', name: 'Carlos Torres', ci: '5555555', phone: '72222222', email: 'carlos@ballet.com', password: 'password123', role: 'Bailarín', status: 'Activo', lastLogin: 'Ayer 18:45' },
];

const initialItems = [
  { id: 'ITM-001', sku: 'TUT-001', name: 'Tutu Cisne Blando', desc: 'Tutú clásico blanco con pedrería', category: 'Traje', size: 'M', location: 'Estante A1', status: 'Disponible', condition: 'Excelente', image: null },
  { id: 'ITM-002', sku: 'ZAP-001', name: 'Zapatillas Punta', desc: 'Zapatillas de punta dura, cinta rosa', category: 'Calzado', size: '38', location: 'Caja B2', status: 'Disponible', condition: 'Regular', image: null },
  { id: 'ITM-003', sku: 'TUT-002', name: 'Tutu Cisne Negro', desc: 'Tutú negro con plumas sintéticas', category: 'Traje', size: 'S', location: 'Estante A2', status: 'En Préstamo', condition: 'Excelente', image: null },
  { id: 'ITM-004', sku: 'ACC-001', name: 'Tiara Brillante', desc: 'Tiara con cristales para solista', category: 'Accesorio', size: 'Única', location: 'Caja Fuerte', status: 'Dañado', condition: 'Dañado', image: null },
  { id: 'ITM-005', sku: 'MAL-001', name: 'Malla Ensayo Negra', desc: 'Malla elástica básica', category: 'Ensayo', size: 'L', location: 'Estante C1', status: 'Disponible', condition: 'Excelente', image: null },
  { id: 'ITM-006', sku: 'TUT-003', name: 'Tutu Lago', desc: 'Tutú para lago de los cisnes', category: 'Traje', size: 'M', location: 'Estante A1', status: 'Agotado', condition: 'Regular', image: null },
];

const initialWorks = [
  { id: 'W1', name: 'El Lago de los Cisnes', premiereDate: '2026-06-15', items: ['ITM-001', 'ITM-003', 'ITM-004'] },
  { id: 'W2', name: 'Gala de Invierno', premiereDate: '2026-07-20', items: ['ITM-002', 'ITM-005', 'ITM-006'] },
];

const initialLoans = [
  { id: 'PR-2026-042', userId: 'U3', items: ['ITM-002', 'ITM-005'], requestDate: 'Hoy 08:15 AM', startDate: '2026-03-01', endDate: '2026-03-05', status: 'Pendiente', motive: 'Gala de Invierno', notes: '', returnCondition: '' },
  { id: 'BR-2025-089', userId: 'U2', items: ['ITM-001', 'ITM-006'], requestDate: 'Hoy 09:15 AM', startDate: '2026-03-10', endDate: '2026-03-15', status: 'Aprobado', motive: 'Gala de Invierno', notes: '', returnCondition: '' },
  { id: 'PR-2025-000', userId: 'U2', items: ['ITM-005'], requestDate: '2025-11-05', startDate: '2025-11-10', endDate: '2025-11-15', status: 'Devuelto', motive: 'Ensayo', notes: '', returnCondition: 'Excelente' },
];

const initialRepairs = [
  { id: 'REP-001', itemId: 'ITM-004', desc: 'Costura rota en espalda', cost: 45.00, type: 'Traje', expectedReturn: '12/03/2026', status: 'En Proceso' }
];

// --- UI COMPONENTS ---
const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-[20px] border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "px-5 py-2.5 rounded-[12px] font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#ff4b72] hover:bg-[#e63e62] text-white shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    outline: "border-2 border-gray-200 hover:border-[#ff4b72] text-gray-700 hover:text-[#ff4b72]",
    danger: "bg-red-50 hover:bg-red-100 text-red-600",
    success: "bg-green-500 hover:bg-green-600 text-white shadow-sm",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, type = 'text', value, onChange, required = false, placeholder = '', className = '', min, max, disabled=false }) => {
  const handleChange = onChange || (() => {});
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">{label}</label>}
      {type === 'textarea' ? (
        <textarea value={value} onChange={handleChange} required={required} placeholder={placeholder} disabled={disabled} className="border-2 border-gray-200 rounded-[12px] p-3 text-sm focus:ring-0 focus:border-[#ff4b72] outline-none resize-none h-24 transition-colors disabled:bg-gray-50" />
      ) : type === 'select' ? (
         <select value={value} onChange={handleChange} required={required} disabled={disabled} className="border-2 border-gray-200 rounded-[12px] p-3 text-sm focus:ring-0 focus:border-[#ff4b72] outline-none bg-white transition-colors disabled:bg-gray-50">
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {min && min.map(opt => <option key={opt} value={opt}>{opt}</option>)}
         </select>
      ) : (
        <input type={type} value={value} onChange={handleChange} required={required} placeholder={placeholder} min={min} max={max} disabled={disabled} className="border-2 border-gray-200 rounded-[12px] p-3 text-sm focus:ring-0 focus:border-[#ff4b72] outline-none transition-colors disabled:bg-gray-50" />
      )}
    </div>
  );
};

const Badge = ({ text, type = 'info' }) => {
  const styles = {
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-blue-100 text-blue-700 border border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
    primary: 'bg-pink-100 text-[#ff4b72] border border-pink-200'
  };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[type] || styles.info}`}>{text}</span>;
};

// --- MAIN APPLICATION ---
export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  
  // DB State
  const [users, setUsers] = useState(initialUsers);
  const [items, setItems] = useState(initialItems);
  const [works, setWorks] = useState(initialWorks);
  const [loans, setLoans] = useState(initialLoans);
  const [repairs, setRepairs] = useState(initialRepairs);
  const [cart, setCart] = useState([]);

  // UI State
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  // Helpers
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showModal = (title, content, actions) => {
    setModal({ title, content, actions });
  };
  const closeModal = () => setModal(null);

  // Auth Functions
  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      if (user.status !== 'Activo') return showToast('Usuario inactivo', 'danger');
      setCurrentUser(user);
      setCurrentView(user.role === 'Admin' ? 'dashboard' : 'catalog');
    } else {
      showToast('Credenciales incorrectas', 'danger');
    }
  };

  const handleRegister = (data) => {
    const newUser = { ...data, id: `U${users.length + 1}`, role: 'Bailarín', status: 'Activo', lastLogin: 'Recién creado' };
    setUsers([...users, newUser]);
    showToast('Registro exitoso. Inicie sesión.');
    setCurrentView('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setCurrentView('login');
  };

  // --- VIEWS ---

  // 1. Login View (Mockup 1)
  const LoginView = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', name: '', ci: '', phone: '' });

    const submit = (e) => {
      e.preventDefault();
      if (isRegister) handleRegister(form);
      else handleLogin(form.email, form.password);
    };

    return (
      <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fc]">
        {/* Fake Browser Header */}
        <div className="bg-gray-200 p-3 flex items-center gap-4 border-b border-gray-300">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="bg-white px-4 py-1.5 rounded-lg text-sm text-gray-500 flex-1 flex items-center gap-2 max-w-2xl mx-auto shadow-sm">
            <Search size={14}/> http://ballet-folk/login
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-lg p-10 !rounded-[30px]">
            {!isRegister ? (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">BALLET<span className="text-[#ff4b72]">INVENTARIO</span></h1>
                </div>
                <form onSubmit={submit} className="space-y-5">
                  <Input type="email" placeholder="usuario@ballet.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  <Input type="password" placeholder="*********" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                  <div className="flex justify-center mt-8">
                    <Button type="submit" className="w-[200px] !rounded-full py-3 text-lg">Iniciar Sesion</Button>
                  </div>
                  <div className="flex justify-between items-center mt-6 text-sm font-bold text-gray-500">
                    <button type="button" className="hover:text-[#ff4b72]">Olvidaste tu contraseña?</button>
                    <button type="button" onClick={() => setIsRegister(true)} className="text-[#ff4b72]">Registrarse</button>
                  </div>
                </form>
              </>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-gray-900">Registro de Usuario</h2>
                </div>
                <Input label="Nombre Completo" placeholder="Juan Perez Torres" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <div className="flex gap-4">
                  <Input label="Cedula de Identidad" placeholder="7777777" value={form.ci} onChange={e => setForm({...form, ci: e.target.value})} required className="flex-1" />
                  <Input label="Telefono" placeholder="72345678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required className="flex-1" />
                </div>
                <Input label="Correo Electronico" type="email" placeholder="bailarin@ballet.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                <Input label="Contraseña" type="password" placeholder="********" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" required className="w-4 h-4 text-[#ff4b72] rounded focus:ring-[#ff4b72]" />
                  <span className="text-sm font-bold text-gray-600">Acepto términos</span>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setIsRegister(false)} className="!rounded-full px-8">VOLVER</Button>
                  <Button type="submit" className="!rounded-full px-8">Registrarse</Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    );
  };

  // 2. Admin Dashboard View (Mockup 2)
  const DashboardView = () => {
    const overdueLoans = loans.filter(l => l.status === 'Vencido' || l.status === 'Pendiente'); // Using Pendiente just to show data from mockup
    const pendingLoans = loans.filter(l => l.status === 'Pendiente' || l.status === 'Aprobado');

    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard General</h2>
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="flex flex-col items-center justify-center p-8 border-2 border-gray-100 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rotate-45 rounded mb-4 flex items-center justify-center"><Box className="-rotate-45 text-gray-500" size={20}/></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Piezas</p>
            <h3 className="text-4xl font-black text-gray-800">500</h3>
          </Card>
          <Card className="flex flex-col items-center justify-center p-8 border-2 border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rotate-45 rounded mb-4 flex items-center justify-center"><ShoppingCart className="-rotate-45 text-blue-500" size={20}/></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">En Prestamo</p>
            <h3 className="text-4xl font-black text-gray-800">50</h3>
          </Card>
          <Card className="flex flex-col items-center justify-center p-8 border-2 border-gray-100">
            <div className="w-12 h-12 bg-yellow-50 rotate-45 rounded mb-4 flex items-center justify-center"><Wrench className="-rotate-45 text-yellow-500" size={20}/></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">En Reparacion</p>
            <h3 className="text-4xl font-black text-gray-800">12</h3>
          </Card>
          <Card className="flex flex-col items-center justify-center p-8 border-2 border-gray-100">
            <div className="w-12 h-12 bg-red-50 rotate-45 rounded mb-4 flex items-center justify-center"><AlertCircle className="-rotate-45 text-red-500" size={20}/></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Con Retraso</p>
            <h3 className="text-4xl font-black text-gray-800">5</h3>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Alertas de Morosidad */}
          <Card className="border-2 border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-800">Alerta de Morosidad</h3>
              <Badge text="Filtrar" type="gray"/>
            </div>
            <div className="space-y-4">
              {overdueLoans.map((loan, idx) => {
                const user = users.find(u => u.id === loan.userId);
                return (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Tutu Cisne Blando (Talla M)</p>
                      <p className="text-xs text-gray-500 font-medium">{user?.name} <span className="text-[#ff4b72]">• 2 Dias Retraso</span></p>
                    </div>
                    <Button variant="outline" className="text-xs py-1.5 px-4 !rounded-md">Avisar</Button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Solicitudes Pendientes */}
          <Card className="border-2 border-gray-100">
            <h3 className="text-lg font-black text-gray-800 mb-6">Solicitudes Pendientes</h3>
            <div className="space-y-6">
              {pendingLoans.map((loan, idx) => {
                const user = users.find(u => u.id === loan.userId);
                return (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Solicitud {loan.id}</p>
                      <p className="text-xs text-gray-500 font-medium">{user?.name} • {loan.items.length} Prendas • Para Obra</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"><CheckCircle size={16}/></button>
                      <button className="w-8 h-8 rounded-full border-2 border-[#ff4b72] flex items-center justify-center text-[#ff4b72] hover:bg-pink-50 transition-colors"><XCircle size={16}/></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // 3,4,5. Admin Prestamos View (Mockups 3, 4, 5)
  const LoansAdminView = () => {
    const [tab, setTab] = useState('Pendientes');

    // MOCKUP 3: Pendientes
    const PendientesTab = () => (
      <div className="space-y-6 mt-6">
        <h3 className="text-xl font-bold text-gray-800">Solicitudes Pendientes de Aprobacion</h3>
        {loans.filter(l => l.status === 'Pendiente').map(loan => {
           const user = users.find(u => u.id === loan.userId);
           return (
            <div key={loan.id} className="border-2 border-gray-200 rounded-[20px] p-6 bg-white relative">
              <div className="absolute top-6 right-6 text-xs font-bold text-gray-400">Fecha Solicitud: {loan.requestDate}</div>
              <div className="flex items-center gap-4 mb-4">
                <h4 className="text-xl font-black text-gray-800">Folio {loan.id}</h4>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">Pendiente</span>
              </div>
              <div className="mb-6 space-y-1">
                <p className="text-sm font-medium text-gray-600">Solicitante: <span className="text-gray-900 font-bold">{user?.name}</span> (bailarin)</p>
                <p className="text-sm font-medium text-gray-600">Para: <span className="text-gray-900 font-bold">{loan.motive}</span></p>
              </div>
              <div className="border-2 border-gray-100 rounded-[12px] p-4 bg-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">ITEMS SOLICITADOS (#{loan.items.length})</p>
                <div className="space-y-2">
                  {loan.items.map(itemId => {
                    const item = items.find(i => i.id === itemId);
                    return (
                      <div key={item.id} className="flex justify-between items-center text-sm font-bold text-gray-800">
                        <span>{item.name} (Talla {item.size})</span>
                        <span className="text-xs text-gray-400 font-mono">{item.sku}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                 <Button variant="outline" className="border-[#ff4b72] text-[#ff4b72]">Rechazar</Button>
                 <Button>Aprobar Solicitud</Button>
              </div>
            </div>
           )
        })}
      </div>
    );

    // MOCKUP 4: Entregas Fisicas
    const EntregasTab = () => {
      const loan = loans.find(l => l.status === 'Aprobado');
      if(!loan) return <p className="mt-6 text-gray-500">No hay entregas pendientes.</p>;
      const user = users.find(u => u.id === loan.userId);

      return (
        <div className="space-y-6 mt-6 max-w-2xl">
          <h3 className="text-xl font-bold text-gray-800">Confirmar Salida Almacén</h3>
          <Card className="border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <h4 className="text-lg font-black text-gray-800">Folio Aprobado</h4>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">{loan.id}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-6">Bailarin: <span className="text-gray-900 font-bold">{user?.name}</span></p>
            
            <div className="border-b-2 border-gray-100 pb-4 mb-4 font-bold text-sm text-gray-800">
              {loan.items.length} Prendas Lista Para Entregar <span className="float-right font-normal">Estado: Excelente</span>
            </div>

            <form className="space-y-6">
              <Input label="Observaciones al entregar" type="textarea" placeholder="Escribe aqui..." />
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-[12px] flex items-center justify-center text-gray-400">
                  <ImageIcon size={24}/>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">Tomar Foto de Evidencia</p>
                  <p className="text-xs text-[#ff4b72] font-bold mb-2">Requerido</p>
                  <Button variant="outline" className="py-1.5 text-xs"><Upload size={14}/> Subir foto</Button>
                </div>
              </div>

              <Button className="w-full text-lg py-3 mt-4">Registrar Salida</Button>
            </form>
          </Card>
        </div>
      );
    };

    // MOCKUP 5: Devoluciones
    const DevolucionesTab = () => (
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Registro de Devoluciones</h3>
          <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input type="text" placeholder="Buscar Prestamo Activo..." className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-[12px] font-bold outline-none focus:border-[#ff4b72] text-sm" />
          </div>

          <Card className="border-2 border-gray-200 mb-4 bg-gray-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Folio: PR-2026-042 (Carlos Torres)</p>
            <div className="flex justify-between items-center mt-3">
               <span className="font-bold text-gray-800">Tutu cisne (Talla M)</span>
               <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#ff4b72] focus:ring-[#ff4b72]" />
            </div>
            <div className="mt-4">
              <Input label="Observaciones de retorno" placeholder="Detalles sobre estado..." />
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6 invisible">Resumen</h3>
          <Card className="border-2 border-gray-200 bg-white shadow-xl">
            <h4 className="text-lg font-black text-gray-800 border-b-2 border-gray-100 pb-4 mb-4">Resumen de Recepcion</h4>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-500">Total Items</span>
                <span className="text-gray-800">1</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-500">Estado</span>
                <span className="text-[#ff4b72]">Vencido</span>
              </div>
              <div className="flex justify-between text-sm font-black text-lg mt-4 pt-4 border-t-2 border-gray-100">
                <span className="text-gray-800">Multa estimada</span>
                <span className="text-gray-800">0.00</span>
              </div>
            </div>
            <Button className="w-full py-3 text-lg bg-green-500 hover:bg-green-600">Confirmar Recepcion</Button>
          </Card>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">GESTION DE PRESTAMOS</h2>
        <div className="flex gap-8 border-b-2 border-gray-200 mt-2">
          {['Pendientes', 'Entregas Fisicas', 'Devoluciones'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pb-3 font-black text-sm uppercase tracking-wide transition-colors relative ${tab === t ? 'text-[#ff4b72]' : 'text-gray-400 hover:text-gray-700'}`}>
              {t}
              {tab === t && <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-[#ff4b72] rounded-t-md"></div>}
            </button>
          ))}
        </div>
        {tab === 'Pendientes' && <PendientesTab />}
        {tab === 'Entregas Fisicas' && <EntregasTab />}
        {tab === 'Devoluciones' && <DevolucionesTab />}
      </div>
    );
  };

  // 6. Inventario (Mockup 6)
  const InventoryView = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ id: '', sku: '', name: '', category: 'Traje', size: '', location: '', status: 'Disponible', desc: '' });
    
    // Filtros
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const filteredItems = items.filter(i => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'Todos' || i.category === catFilter;
      const matchStatus = statusFilter === 'Todos' || i.status === statusFilter || (statusFilter === 'Dañado / Limpieza' && (i.status === 'Dañado' || i.status === 'En Limpieza'));
      return matchSearch && matchCat && matchStatus;
    });

    const handleSave = (e) => {
      e.preventDefault();
      if (formData.id) {
         setItems(items.map(i => i.id === formData.id ? formData : i));
         showToast('Prenda actualizada exitosamente');
      } else {
         setItems([...items, { ...formData, id: `ITM-00${items.length + 7}`, condition: 'Excelente' }]);
         showToast('Prenda registrada exitosamente');
      }
      setShowForm(false);
    };

    const handleEdit = (item) => {
      setFormData(item);
      setShowForm(true);
    };

    if (showForm) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{formData.id ? 'Editar Prenda' : 'Nueva Prenda'}</h2>
            <Button variant="outline" onClick={() => setShowForm(false)}>Volver al Inventario</Button>
          </div>
          <Card className="border-2 border-gray-200 bg-gray-50">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="SKU / Código" placeholder="Ej. TUT-009" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
                <Input label="Nombre de Prenda" placeholder="Ej. Tutú de ensayo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <Input label="Categoría" type="select" min={['Traje', 'Calzado', 'Accesorio', 'Ensayo']} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                <Input label="Talla" placeholder="S, M, L, 38..." value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                <Input label="Ubicación Física" placeholder="Ej. Estante A3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <Input label="Estado" type="select" min={['Disponible', 'En Préstamo', 'En Limpieza', 'Dañado', 'Agotado']} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} required />
              </div>
              <Input label="Descripción Detallada" type="textarea" placeholder="Escribe los detalles de la prenda aquí..." value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} required />
              <div className="flex justify-end pt-4 border-t-2 border-gray-200">
                <Button type="submit" className="px-8 text-lg">{formData.id ? 'Guardar Cambios' : 'Registrar Prenda'}</Button>
              </div>
            </form>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gestion de Inventario</h2>
          <p className="text-sm font-bold text-gray-400 mt-1">Registro de prendas, categoria y piezas</p>
        </div>

        <Card className="border-2 border-gray-200">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
               <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Buscador (SKU, Nombre)</label>
               <div className="relative">
                 <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                 <input type="text" placeholder="Buscar Prendas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-[12px] font-bold outline-none text-sm" />
               </div>
            </div>
            <Input label="Categoria" type="select" min={['Todos', 'Traje', 'Calzado', 'Accesorio', 'Ensayo']} value={catFilter} onChange={e => setCatFilter(e.target.value)} />
            <div className="flex items-end gap-2">
               <Input label="Estado Fisico" type="select" min={['Todos', 'Disponible', 'En Préstamo', 'Regular', 'Dañado / Limpieza']} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="flex-1" />
               <Button className="h-[48px] px-4" onClick={() => { setFormData({ id: '', sku: '', name: '', category: 'Traje', size: '', location: '', status: 'Disponible', desc: '' }); setShowForm(true); }}><Plus size={20}/></Button>
            </div>
          </div>

          {/* Table */}
          <div className="border-2 border-gray-200 rounded-[16px] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr className="text-xs font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-200">
                  <th className="p-4">SKU/ID</th>
                  <th className="p-4">Prenda</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Talla</th>
                  <th className="p-4">Ubicacion</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="font-bold text-gray-800">
                {filteredItems.map((item, idx) => (
                  <tr key={item.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4 text-xs font-mono text-gray-500">{item.sku}</td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4 text-gray-500">{item.category}</td>
                    <td className="p-4">{item.size}</td>
                    <td className="p-4 text-gray-500">{item.location}</td>
                    <td className="p-4 text-xs uppercase tracking-wide">{item.status}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleEdit(item)} className="text-xl font-light text-gray-400 hover:text-[#ff4b72] transition-colors"><Edit2 size={16} className="inline"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  // 6.5 Obras y Funciones (Nueva Vista)
  const WorksView = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', premiereDate: '', items: [] });
    const [searchItem, setSearchItem] = useState('');

    const handleSave = (e) => {
      e.preventDefault();
      if (formData.id) {
        setWorks(works.map(w => w.id === formData.id ? formData : w));
        showToast('Obra actualizada exitosamente');
      } else {
        setWorks([...works, { ...formData, id: `W${works.length + 1}` }]);
        showToast('Obra registrada exitosamente');
      }
      setShowForm(false);
    };

    const handleEdit = (work) => {
      setFormData(work);
      setShowForm(true);
    };

    const toggleItem = (itemId) => {
      if (formData.items.includes(itemId)) {
        setFormData({ ...formData, items: formData.items.filter(id => id !== itemId) });
      } else {
        setFormData({ ...formData, items: [...formData.items, itemId] });
      }
    };

    if (showForm) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{formData.id ? 'Editar Obra' : 'Nueva Obra'}</h2>
            <Button variant="outline" onClick={() => setShowForm(false)}>Volver a Obras</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200 lg:col-span-1 h-fit bg-gray-50">
              <form onSubmit={handleSave} className="space-y-6">
                <Input label="Nombre de la Obra" placeholder="Ej. El Cascanueces" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <Input label="Fecha de Estreno" type="date" value={formData.premiereDate} onChange={e => setFormData({...formData, premiereDate: e.target.value})} required />
                <div className="pt-4 border-t-2 border-gray-200">
                  <p className="text-sm font-bold text-gray-600 mb-4">Total prendas asignadas: <span className="text-[#ff4b72]">{formData.items.length}</span></p>
                  <Button type="submit" className="w-full text-lg py-3">Guardar Obra</Button>
                </div>
              </form>
            </Card>

            <Card className="border-2 border-gray-200 lg:col-span-2">
              <h3 className="text-lg font-black text-gray-800 mb-4">Asignar Vestuario</h3>
              <div className="relative mb-4">
                 <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                 <input type="text" placeholder="Buscar por nombre o SKU..." value={searchItem} onChange={e => setSearchItem(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-[12px] font-bold outline-none text-sm" />
              </div>
              <div className="max-h-[400px] overflow-y-auto border-2 border-gray-100 rounded-[12px] p-2 space-y-2">
                 {items.filter(i => i.name.toLowerCase().includes(searchItem.toLowerCase()) || i.sku.toLowerCase().includes(searchItem.toLowerCase())).map(item => (
                   <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border-2 border-transparent hover:border-gray-200 transition-colors cursor-pointer" onClick={() => toggleItem(item.id)}>
                     <div>
                       <p className="font-bold text-sm text-gray-800">{item.name}</p>
                       <p className="text-xs text-gray-500 font-mono">{item.sku} • Talla: {item.size}</p>
                     </div>
                     <input type="checkbox" checked={formData.items.includes(item.id)} readOnly className="w-5 h-5 rounded border-gray-300 text-[#ff4b72] focus:ring-[#ff4b72]" />
                   </div>
                 ))}
                 {items.length === 0 && <p className="text-sm text-gray-500 p-4 text-center">No hay prendas disponibles.</p>}
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Obras y Funciones</h2>
            <p className="text-sm font-bold text-gray-400 mt-1">Gestión de temporadas y asignación de vestuario</p>
          </div>
          <Button onClick={() => { setFormData({ id: '', name: '', premiereDate: '', items: [] }); setShowForm(true); }}><Plus size={20}/> Nueva Obra</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {works.map(work => (
            <Card key={work.id} className="border-2 border-gray-200 flex flex-col relative overflow-hidden group hover:border-[#ff4b72] transition-colors">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#ff4b72]"></div>
              <h3 className="text-xl font-black text-gray-800 mt-2 mb-1">{work.name}</h3>
              <p className="text-xs font-bold text-gray-500 mb-6 flex items-center gap-1"><Calendar size={14}/> Estreno: {work.premiereDate}</p>
              
              <div className="mt-auto bg-gray-50 p-4 rounded-[12px] flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vestuario Asignado</p>
                  <p className="text-lg font-black text-[#ff4b72]">{work.items.length} piezas</p>
                </div>
                <button onClick={() => handleEdit(work)} className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-[#ff4b72] hover:border-[#ff4b72] transition-colors shadow-sm">
                  <ChevronRight size={20}/>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // 7. Daños y Reparaciones (Mockup 7)
  const RepairsView = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Control de Daños y Reparaciones</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form */}
          <Card className="border-2 border-gray-200 bg-gray-50 lg:col-span-1">
            <h3 className="text-lg font-black text-gray-800 mb-6">Nuevo Reporte de Daño</h3>
            <form className="space-y-4">
              <Input label="SKU de la Pieza" placeholder="ej. TUT-0001" />
              <Input label="Tipo de Daño" />
              <Input label="Costo Estimado" />
              <Input label="Evidencia (Fotos)" />
              <Button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-none">Registrar en Mantenimiento</Button>
            </form>
          </Card>

          {/* Table */}
          <Card className="border-2 border-gray-200 lg:col-span-2 overflow-hidden px-0 py-0">
             <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr className="text-xs font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-200">
                  <th className="p-4">Pieza</th>
                  <th className="p-4">Daño</th>
                  <th className="p-4">Costo</th>
                  <th className="p-4">Retorno</th>
                  <th className="p-4 text-center">Accion</th>
                </tr>
              </thead>
              <tbody className="font-bold text-gray-800">
                {repairs.map((rep) => (
                  <tr key={rep.id} className="border-b border-gray-100 bg-white">
                    <td className="p-4 text-xs font-mono">{rep.itemId}</td>
                    <td className="p-4 text-sm font-normal text-gray-600">{rep.desc}</td>
                    <td className="p-4 text-sm font-mono">bs. {rep.cost}</td>
                    <td className="p-4 text-sm text-gray-500">{rep.expectedReturn}</td>
                    <td className="p-4 text-center">
                      <Button variant="outline" className="text-[10px] py-1 px-2 !rounded-md uppercase tracking-wide">Marcar reparado</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  };

  // 8. Gestion de usuarios (Mockup 8)
  const UsersView = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Control de Daños y Reparaciones</h2> {/* Title from Mockup 8 has this text erroneously, copying exactly */}
          <Button variant="outline" className="!rounded-full px-6">Nuevo usuario</Button>
        </div>
        
        <Card className="border-2 border-gray-200 overflow-hidden px-0 py-0 mt-4">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr className="text-xs font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-200">
                <th className="p-4">Usuario</th>
                <th className="p-4">CI / Telefono</th>
                <th className="p-4">Rol</th>
                <th className="p-4 text-center">Ultima Conexion</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Gestion</th>
              </tr>
            </thead>
            <tbody className="font-bold text-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 bg-white">
                  <td className="p-4 text-base">{user.name}</td>
                  <td className="p-4 text-xs font-mono text-gray-500 leading-tight">
                    CI: {user.ci}<br/>Tel: {user.phone}
                  </td>
                  <td className="p-4">
                    <span className="border border-gray-300 px-3 py-1 rounded text-xs">{user.role}</span>
                  </td>
                  <td className="p-4 text-xs text-center text-gray-500">{user.lastLogin}</td>
                  <td className="p-4 text-center">
                    <span className="border border-gray-300 px-3 py-1 rounded-full text-xs">{user.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs text-gray-400 hover:text-[#ff4b72] underline uppercase tracking-wide">Editar Perfil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };

  // 9. Reportes (Mockup 9)
  const ReportsView = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gneracion de Reportes</h2>
          <p className="text-sm font-bold text-gray-400 mt-1">Descarga de estadisticas e historias</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card className="border-2 border-gray-200">
            <h3 className="text-lg font-black text-gray-800 mb-6">Configura Reporte</h3>
            <div className="space-y-4">
              <Input label="Tipo de Reporte" value="Estado general del intervalo" disabled />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Fecha Inicio" />
                <Input label="Fecha Fin" />
              </div>
              <div className="flex gap-4 mt-6 pt-4">
                <Button variant="outline" className="flex-1 text-lg py-3">Excel</Button>
                <Button variant="outline" className="flex-1 text-lg py-3">PDF</Button>
              </div>
            </div>
          </Card>
          
          <Card className="border-2 border-gray-200 bg-gray-50">
            <h3 className="text-lg font-black text-gray-800 mb-6">Vistas Rapidas</h3>
            <div className="space-y-6 text-sm font-bold text-gray-600">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span>Prenda mas solicitada</span>
                <span className="text-gray-400 tracking-widest">*******</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span>usuario con mas prestamos</span>
                <span className="text-gray-400 tracking-widest">*******</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span>valor estimado en mora</span>
                <span className="text-gray-400 tracking-widest">*******</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span>Costo de reparacion</span>
                <span className="text-gray-400 tracking-widest">*******</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // 10. Carrito Bailarin (Mockup 10)
  const CartView = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">mi carrito de prestamos</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
          <Card className="border-2 border-gray-200 lg:col-span-2 min-h-[300px] flex flex-col items-center justify-center bg-gray-50">
             <h3 className="text-xl font-medium text-gray-600 mb-6">Tu carrito esta vacio</h3>
             <Button variant="outline" onClick={() => setCurrentView('catalog')} className="px-8 !rounded-full text-gray-600 border-gray-300">Ir al catalogo</Button>
          </Card>
          
          <Card className="border-2 border-gray-200 lg:col-span-1">
            <h3 className="text-lg font-black text-gray-800 mb-6">Detalle del Prestamo</h3>
            <div className="space-y-4">
              <Input label="fecha de prestamo" />
              <Input label="fecha de devolucion" />
              <Input label="motivo de solicitud" type="textarea" />
              <Button variant="outline" className="w-full mt-4 !rounded-full border-gray-300 text-gray-600">Confirmar Solicitud</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // 11. Catalogo (Mockup 11)
  const CatalogView = () => {
    return (
      <div className="space-y-8">
        {/* Banner Temporada */}
        <Card className="border-2 border-gray-200 flex justify-between items-center p-8 bg-gray-50">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Temporada de Invirno</h2>
          <Button variant="outline" className="!rounded-md border-gray-300 bg-white text-xs font-black uppercase tracking-wide">Ver Coleccion</Button>
        </Card>

        {/* Catalogo */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-6">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Catalogo de vestuario</h3>
            <div className="flex gap-2 mt-4 md:mt-0">
               <div className="relative w-48">
                 <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                 <input type="text" placeholder="Buscar prenda" className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-md text-sm outline-none font-bold" />
               </div>
               <button className="border-2 border-gray-200 px-3 py-2 rounded-md text-sm font-bold text-gray-600 bg-white">Categoria</button>
               <button className="border-2 border-gray-200 px-3 py-2 rounded-md text-sm font-bold text-gray-600 bg-white">Talla</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((item, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-[24px] p-4 flex flex-col items-center justify-between h-64 bg-white hover:border-[#ff4b72] transition-colors cursor-pointer relative group">
                {idx === 2 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-[24px]">
                    <span className="border-2 border-gray-300 bg-white text-gray-600 px-4 py-2 font-bold rounded-md text-sm">Agotado</span>
                  </div>
                )}
                <div className="flex-1 w-full bg-gray-50 rounded-[16px] mb-4 flex items-center justify-center text-gray-300 group-hover:bg-pink-50 transition-colors">
                  <ImageIcon size={32} />
                </div>
                <p className="font-bold text-gray-600 text-sm w-full text-center">Zapatilla</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 12. Mis Solicitudes (Mockup 12)
  const MyRequestsView = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Mi solicitud de prestamo</h2>
        
        <div className="space-y-4 mt-8">
          {[1,2,3].map((item, idx) => (
            <Card key={idx} className="border-2 border-gray-200 flex flex-col md:flex-row justify-between items-center bg-gray-50 !rounded-[20px] py-4 px-6">
              <div className="flex items-center gap-6">
                <span className="text-lg font-bold text-gray-500">PR-2026-000</span>
                <span className="border border-gray-300 bg-white text-gray-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded">Pendiente de Aprobacion</span>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0 !rounded-md bg-white border-gray-300 text-xs font-bold text-gray-500 uppercase tracking-wide px-6">Ver comprobante</Button>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // 13. Mi Historial (Mockup 13)
  const MyLoansView = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Mi historial de prestamos</h2>
        
        <Card className="border-2 border-gray-200 overflow-hidden px-0 py-0 mt-6 !rounded-[24px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-white">
              <tr className="text-xs font-black text-gray-400 lowercase border-b-2 border-gray-100">
                <th className="p-6">Folio</th>
                <th className="p-6">Prendas utilizadas</th>
                <th className="p-6 text-center">salida - devolucion</th>
                <th className="p-6 text-right">estado final</th>
              </tr>
            </thead>
            <tbody className="font-bold text-gray-600">
              {[1,2,3].map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 bg-white">
                  <td className="p-6 text-sm font-medium">PR-2025-000</td>
                  <td className="p-6 font-normal">Malla ensayo</td>
                  <td className="p-6 text-center font-normal text-gray-500">10 nov - 15 nov, 2025</td>
                  <td className="p-6 text-right font-normal text-gray-500">devuelto OK</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };

  // 14. Mi Perfil (Mockup 14)
  const ProfileView = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Mi perfil</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <Card className="border-2 border-gray-200 lg:col-span-1 flex flex-col items-center justify-center py-12">
            <div className="w-40 h-40 rounded-full border-4 border-gray-200 mb-6"></div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Carlos Torres</h3>
            <p className="text-sm font-bold text-gray-500 mt-1">Bailarin</p>
          </Card>
          
          <Card className="border-2 border-gray-200 lg:col-span-2">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b-2 border-gray-100 pb-8">
              <Input label="Nombre Completo" />
              <Input label="Celuda de Identidad" />
              <Input label="Correo electronico" />
              <Input label="telefono" />
            </div>
            
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6">Seguridad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
               <Input label="Nueva contraseña" type="password" placeholder="********" />
               <Button variant="outline" className="border-gray-300 text-gray-600 !rounded-full py-3">Guardar cambios</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // 15. Novedades (Mockup 15)
  const NewsView = () => {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-8">NOVEDADES</h2>
        
        <div className="flex justify-center items-center gap-4 w-full overflow-hidden">
          {/* Left Card */}
          <div className="w-64 h-80 bg-gray-100 rounded-[20px] border-2 border-gray-200 flex flex-col opacity-50 scale-90 transition-transform">
             <div className="m-4 flex-1 border-2 border-gray-300 rounded-[20px]"></div>
             <p className="p-4 text-center font-handwriting text-gray-600 text-sm">eget nunc lobortis mattis</p>
          </div>
          
          {/* Center Card (POPULAR) */}
          <div className="w-72 h-96 bg-gray-50 rounded-[20px] border-[3px] border-purple-500 flex flex-col relative shadow-xl z-10 bg-white">
             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white font-black text-[10px] tracking-widest px-4 py-1 rounded">POPULAR</div>
             <div className="m-6 flex-1 border-2 border-gray-200 rounded-[24px]"></div>
             <p className="p-6 pt-0 text-center font-handwriting text-gray-800 text-sm font-bold flex items-center justify-center gap-2">
               <span className="text-blue-500">✔</span> vitae nunc sed velit dignissim
             </p>
          </div>
          
          {/* Right Card */}
          <div className="w-64 h-80 bg-gray-100 rounded-[20px] border-2 border-gray-200 flex flex-col opacity-50 scale-90 transition-transform">
             <div className="m-4 flex-1 border-2 border-gray-300 rounded-[20px]"></div>
             <p className="p-4 text-center font-handwriting text-gray-600 text-sm">eget nunc lobortis mattis</p>
          </div>
        </div>
      </div>
    );
  };

  // App Router
  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView />;
      case 'loans': return <LoansAdminView />;
      case 'inventory': return <InventoryView />;
      case 'works': return <WorksView />;
      case 'repairs': return <RepairsView />;
      case 'users': return <UsersView />;
      case 'reports': return <ReportsView />;
      
      case 'catalog': return <CatalogView />;
      case 'cart': return <CartView />;
      case 'myRequests': return <MyRequestsView />;
      case 'myLoans': return <MyLoansView />;
      case 'profile': return <ProfileView />;
      case 'news': return <NewsView />;
      
      default: return currentUser?.role === 'Admin' ? <DashboardView /> : <CatalogView />;
    }
  };

  // Nav Links setup mapping to Mockups exactly
  const adminLinks = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'loans', label: 'Prestamos y Morosidad' },
    { id: 'inventory', label: 'Inventario de Prendas' },
    { id: 'works', label: 'Obras y Funciones' },
    { id: 'repairs', label: 'Control de Daños' },
    { id: 'users', label: 'Gestion de usuarios' },
    { id: 'reports', label: 'Reportes y Exportacion' },
  ];

  const dancerLinks = [
    { id: 'catalog', label: 'Catalogo de prendas' },
    { id: 'cart', label: 'Mi carrito' },
    { id: 'myRequests', label: 'Mis solicitudes' },
    { id: 'myLoans', label: 'Mi historial' },
    { id: 'profile', label: 'Mi perfil' },
    { id: 'news', label: 'Novedades' },
  ];

  const currentLinks = currentUser?.role === 'Admin' ? adminLinks : dancerLinks;

  if (currentView === 'login') return <LoginView />;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-800 selection:bg-pink-100">
      
      {/* Sidebar Area + Fake Browser Header combined layout to match mockups */}
      <div className="flex flex-col w-full md:w-64 border-r-2 border-gray-100 bg-white">
        
        {/* Header Mockup Area */}
        <div className="h-[60px] border-b-2 border-gray-100 flex items-center px-6">
           <div className="flex items-center gap-3">
             <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
             <h1 className="text-sm font-black text-gray-900 tracking-tighter">BALLETINVENTARIO</h1>
           </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-8 px-4 flex flex-col gap-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Menu Principal</p>
          {currentLinks.map(link => {
            const active = currentView === link.id;
            return (
              <button key={link.id} onClick={() => setCurrentView(link.id)} 
                className={`w-full text-left px-4 py-2.5 rounded-[12px] text-sm font-bold transition-all
                ${active ? 'text-[#ff4b72] bg-pink-50 border border-pink-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                {link.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Top Header matched to Mockup right side */}
        <header className="h-[60px] border-b-2 border-gray-100 px-8 flex justify-end items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-black text-gray-900">{currentUser?.name === 'Admin Principal' ? 'Admin Principal' : currentUser?.name}</p>
              <p className="text-[10px] font-bold text-[#ff4b72]">{currentUser?.role === 'Admin' ? 'Administrador' : 'Bailarin'}</p>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer hover:border-[#ff4b72]" onClick={handleLogout} title="Cerrar Sesión"></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          <div className="max-w-6xl mx-auto pb-20">
            {renderView()}
          </div>
        </div>
      </main>

      {/* --- FLOATING UI OVERLAYS --- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-[16px] shadow-2xl text-sm font-bold
            ${toast.type === 'danger' ? 'bg-[#ff4b72] text-white' : 
              toast.type === 'warning' ? 'bg-yellow-500 text-white' : 
              toast.type === 'info' ? 'bg-blue-600 text-white' : 
              'bg-gray-900 text-white'}`}>
            {toast.type === 'danger' ? <XCircle size={20}/> : <CheckCircle size={20}/>}
            {toast.msg}
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border-2 border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-lg">{modal.title}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
            </div>
            <div className="p-8">
              {modal.content}
            </div>
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              {modal.actions?.map((act, i) => (
                <Button key={i} onClick={act.onClick} variant={act.variant || 'primary'}>{act.label}</Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}