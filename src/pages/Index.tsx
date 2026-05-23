import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useChecklistStore from '@/stores/useChecklistStore'
import { categorias, cronograma, TARGET_DATE, HOJE } from '@/lib/checklist-data'
import { cn } from '@/lib/utils'

function fmtDateLong(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${d.getDate()} de ${meses[d.getMonth()]}. de ${d.getFullYear()}`
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function daysDiff(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return Math.round((d.getTime() - HOJE.getTime()) / (1000 * 60 * 60 * 24))
}

function statusLabel(s: string) {
  return (
    {
      pendente: 'Pendente',
      em_andamento: 'Em andamento',
      concluido: 'Concluído',
      na: 'N/A',
    }[s] || s
  )
}

export default function Index() {
  const { user, acceptPrivacy } = useAuth()
  const { items, loadItems, updateItem, resetAll } = useChecklistStore()

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [showFab, setShowFab] = useState(false)
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    loadItems()
    const handleScroll = () => setShowFab(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const d = new Date()
      const meses = [
        'janeiro',
        'fevereiro',
        'março',
        'abril',
        'maio',
        'junho',
        'julho',
        'agosto',
        'setembro',
        'outubro',
        'novembro',
        'dezembro',
      ]
      setTimeStr(`Hoje: ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const expandAll = () => {
    const next: Record<string, boolean> = { cronograma: true }
    categorias.forEach((c) => (next[c.id] = true))
    setOpenSections(next)
  }

  const collapseAll = () => {
    setOpenSections({})
  }

  const exportJSON = () => {
    const data = { exportadoEm: new Date().toISOString(), itens: items }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'checklist_osc_189_2026.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    let csv = 'Seq;Categoria;Item;Status;Responsavel;Anotacao;Critico\n'
    categorias.forEach((cat) => {
      cat.itens.forEach((i) => {
        const s = items[i.id] || { status: 'pendente', responsavel: '', anotacao: '' }
        const row = [
          i.numero,
          cat.nome,
          i.titulo.replace(/;/g, ','),
          statusLabel(s.status),
          (s.responsavel || '').replace(/;/g, ','),
          (s.anotacao || '').replace(/[;\n\r]/g, ' ').substring(0, 200),
          i.critico ? 'Sim' : 'Nao',
        ]
        csv += row.join(';') + '\n'
      })
    })
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'checklist_osc_189_2026.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const prog = useMemo(() => {
    let total = 0,
      done = 0,
      na = 0,
      crit = 0,
      critPending = 0
    categorias.forEach((cat) => {
      cat.itens.forEach((i) => {
        total++
        const s = items[i.id]?.status || 'pendente'
        if (s === 'concluido') done++
        if (s === 'na') na++
        if (i.critico) {
          crit++
          if (s !== 'concluido' && s !== 'na') critPending++
        }
      })
    })
    const effectiveTotal = total - na
    const pct = effectiveTotal > 0 ? Math.round((done / effectiveTotal) * 100) : 0
    return { total, done, na, effectiveTotal, pct, crit, critPending }
  }, [items])

  const nextEvent = useMemo(() => {
    const futuros = cronograma.filter((e) => daysDiff(e.data) >= 0)
    return futuros.length > 0 ? futuros.sort((a, b) => a.data.localeCompare(b.data))[0] : null
  }, [])

  const limiteDias = daysDiff(TARGET_DATE)

  if (!user?.privacy_accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--app-bg)]">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full border-t-4 border-t-primary">
          <h2 className="text-xl font-bold mb-4">Política de Privacidade</h2>
          <p className="text-sm text-gray-600 mb-6">
            Ao utilizar o Painel de Controle da OSC, você concorda que as informações inseridas
            nestes formulários são de responsabilidade exclusiva da sua organização. O sistema
            armazena os dados de controle para acompanhamento interno do certame e não coleta
            informações pessoais sensíveis além das estritamente necessárias para a operação da
            conta. Os dados são persistidos na infraestrutura Skip Cloud associada a este ambiente.
          </p>
          <button onClick={acceptPrivacy} className="app-btn w-full">
            Li e aceito a Política de Privacidade (v1.0)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page">
      <div className="app-header">
        <div className="app-brand">MTH Compliance — Marcus Thiago, OAB/RS</div>
        <div className="app-title">Painel de Controle da OSC</div>
        <div className="app-subtitle">
          Chamamento Público nº 189/2026 — Município de Alvorada/RS · Apoio à Educação Inclusiva
        </div>
        <div className="app-header-meta">{timeStr}</div>
        <div className="app-progress-wrap">
          <div className="app-progress-bar" style={{ width: `${prog.pct}%` }}></div>
        </div>
        <div className="app-progress-text">
          <span>
            Progresso geral: {prog.pct}% ({prog.done}/{prog.effectiveTotal})
          </span>
          <span>
            Próximo:{' '}
            {nextEvent
              ? daysDiff(nextEvent.data) === 0
                ? 'HOJE'
                : `em ${daysDiff(nextEvent.data)}d`
              : '—'}
          </span>
        </div>
      </div>

      <div
        className={cn(
          'app-alert-banner',
          (prog.critPending > 0 || (limiteDias >= 0 && limiteDias <= 14)) && 'show',
          limiteDias <= 7 && 'danger',
        )}
      >
        {prog.critPending > 0 && limiteDias >= 0 && limiteDias <= 14 ? (
          <>
            <strong>Atenção crítica:</strong> faltam {limiteDias} dia(s) para o encerramento das
            inscrições (07/06/2026 pelo item 3.2) e há {prog.critPending} item(ns) crítico(s)
            pendente(s).
          </>
        ) : prog.critPending > 0 ? (
          <strong>{prog.critPending} item(ns) crítico(s) pendente(s).</strong>
        ) : null}
      </div>

      <div className="app-instructions">
        <strong>Como este painel está organizado.</strong>
        <ul>
          <li>
            O painel é genérico — utilizável por qualquer OSC interessada em participar do
            Chamamento Público nº 189/2026 — e segue a sequência prática do trabalho: 1) cronograma
            · 2) janela de impugnação · 3) logística do protocolo · 4) documentos do envelope · 5)
            pós-seleção e celebração.
          </li>
          <li>
            Cada seção tem um cabeçalho clicável: <strong>clique nele para abrir ali mesmo</strong>{' '}
            os campos de controle. Nada é deslocado.
          </li>
          <li>
            Para cada item, marque o <strong>status</strong>, registre o{' '}
            <strong>responsável</strong> e adicione <strong>anotações</strong>. Tudo fica salvo
            automaticamente.
          </li>
          <li>
            Cada item traz a referência expressa ao item ou anexo correspondente do Edital.
            Aderência estrita: nada é citado fora do que o texto convocatório efetivamente prevê.
          </li>
        </ul>
      </div>

      <div className="app-metrics">
        <div className="app-metric">
          <div className="app-metric-label">Próximo marco do Edital</div>
          <div className="app-metric-value">{nextEvent ? nextEvent.titulo : '—'}</div>
          <div className="app-metric-sub">
            {nextEvent
              ? `${fmtDate(nextEvent.data)} · ${
                  daysDiff(nextEvent.data) === 0
                    ? 'HOJE'
                    : daysDiff(nextEvent.data) === 1
                      ? 'amanhã'
                      : `em ${daysDiff(nextEvent.data)} dias`
                }`
              : '—'}
          </div>
        </div>
        <div className="app-metric warning">
          <div className="app-metric-label">Fim das inscrições</div>
          <div className="app-metric-value">
            {limiteDias > 0 ? `${limiteDias} dias` : limiteDias === 0 ? 'HOJE' : 'Encerrado'}
          </div>
          <div className="app-metric-sub">07/06/2026 (item 3.2) · 08/06/2026 (Anexo I)</div>
        </div>
        <div className="app-metric success">
          <div className="app-metric-label">Itens concluídos</div>
          <div className="app-metric-value">{prog.done}</div>
          <div className="app-metric-sub">
            de {prog.effectiveTotal} · {prog.na} N/A
          </div>
        </div>
        <div className="app-metric danger">
          <div className="app-metric-label">Críticos pendentes</div>
          <div className="app-metric-value">{prog.critPending}</div>
          <div className="app-metric-sub">itens essenciais à habilitação</div>
        </div>
      </div>

      <div className="app-filters">
        <input
          type="text"
          className="app-filter-search"
          placeholder="Buscar item, referência ou anotação…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="app-filter-pills">
          {['todos', 'pendente', 'em_andamento', 'concluido', 'na'].map((s) => (
            <button
              key={s}
              className={cn('app-filter-pill', filter === s && 'active')}
              onClick={() => setFilter(s)}
            >
              {s === 'todos'
                ? 'Todos'
                : s === 'pendente'
                  ? 'Pendentes'
                  : s === 'em_andamento'
                    ? 'Em andamento'
                    : s === 'concluido'
                      ? 'Concluídos'
                      : 'N/A'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className={cn('app-section', openSections['cronograma'] && 'open')}>
          <div className="app-section-head" onClick={() => toggleSection('cronograma')}>
            <div className="app-section-num">1</div>
            <div className="app-section-head-text">
              <h2>Cronograma do Edital (Anexo I)</h2>
              <p>Datas oficiais do certame · contagem regressiva ao vivo</p>
            </div>
            <div className="app-section-progress">
              <div className="app-section-progress-text">{cronograma.length} marcos</div>
            </div>
            <div className="app-section-toggle">▼</div>
          </div>
          <div className="app-section-body">
            <div className="app-section-note">
              Apenas datas literais previstas no Edital (Anexo I e item 3.2). A divergência interna
              entre o item 3.2 (07/06) e o Anexo I (08/06) está sinalizada nos marcos
              correspondentes.
            </div>
            <div className="app-timeline">
              {[...cronograma]
                .sort((a, b) => a.data.localeCompare(b.data))
                .map((e, idx) => {
                  const dias = daysDiff(e.data)
                  let cls = 'app-tl-item'
                  if (dias < 0) cls += ' passed'
                  else if (dias === 0) cls += ' today'
                  else if (e.tipo === 'critico') cls += ' critical'

                  let countdown = ''
                  let cdCls = 'app-tl-countdown'
                  if (dias < 0) {
                    countdown = `há ${Math.abs(dias)}d`
                    cdCls += ' passed'
                  } else if (dias === 0) {
                    countdown = 'HOJE'
                    cdCls += ' warn'
                  } else if (dias === 1) {
                    countdown = 'amanhã'
                    cdCls += ' warn'
                  } else if (dias <= 7) {
                    countdown = `em ${dias}d`
                    cdCls += ' warn'
                  } else {
                    countdown = `em ${dias}d`
                  }

                  return (
                    <div key={idx} className={cls}>
                      <div className="app-tl-date">
                        {fmtDateLong(e.data)}
                        <span className={cdCls}>{countdown}</span>
                      </div>
                      <div className="app-tl-title">{e.titulo}</div>
                      <div className="app-tl-desc">{e.desc}</div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {categorias.map((cat) => {
          let catTotal = cat.itens.length
          let catDone = 0
          let catNa = 0
          cat.itens.forEach((i) => {
            const s = items[i.id]?.status || 'pendente'
            if (s === 'concluido') catDone++
            if (s === 'na') catNa++
          })
          const effective = catTotal - catNa
          const pct = effective > 0 ? Math.round((catDone / effective) * 100) : 100

          let visibleCount = 0
          const searchLower = search.toLowerCase()

          const renderItems = cat.itens.map((item) => {
            const state = items[item.id] || { status: 'pendente', responsavel: '', anotacao: '' }
            if (filter !== 'todos' && state.status !== filter) return null
            if (searchLower) {
              const refsText = (item.refs || []).map((r) => r.t).join(' ')
              const haystack =
                `${item.titulo} ${item.desc} ${refsText} ${state.responsavel} ${state.anotacao}`.toLowerCase()
              if (!haystack.includes(searchLower)) return null
            }
            visibleCount++

            return (
              <div key={item.id} className={cn('app-item', state.status)}>
                <div className="app-item-header">
                  <div className="app-item-num">{item.numero}</div>
                  <div className="app-item-title-block">
                    <div className="app-item-title">{item.titulo}</div>
                    <div className="app-item-desc">{item.desc}</div>
                    <div className="app-item-refs">
                      {item.refs?.map((r, i) => (
                        <span key={i} className={cn('app-ref-tag', r.c)}>
                          {r.t}
                        </span>
                      ))}
                      {item.critico && <span className="app-ref-tag crit">● Crítico</span>}
                    </div>
                  </div>
                </div>
                <div className="app-item-controls">
                  <div className="app-control-row">
                    <label>Status</label>
                    <select
                      value={state.status}
                      onChange={(e) => updateItem(item.id, { status: e.target.value as any })}
                    >
                      <option value="pendente">⚪ Pendente</option>
                      <option value="em_andamento">🟡 Em andamento</option>
                      <option value="concluido">🟢 Concluído</option>
                      <option value="na">⚫ N/A</option>
                    </select>
                  </div>
                  <div className="app-control-row">
                    <label>Responsável dentro da OSC</label>
                    <input
                      type="text"
                      placeholder="Nome do responsável interno"
                      value={state.responsavel}
                      onChange={(e) => updateItem(item.id, { responsavel: e.target.value })}
                    />
                  </div>
                  <div className="app-control-row">
                    <label>Anotação / observação</label>
                    <textarea
                      placeholder="Anotação, link interno, número de protocolo, validade da certidão…"
                      value={state.anotacao}
                      onChange={(e) => updateItem(item.id, { anotacao: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )
          })

          return (
            <div
              key={cat.id}
              className={cn(
                'app-section',
                openSections[cat.id] && 'open',
                pct === 100 ? 'done' : pct > 0 ? 'partial' : '',
              )}
            >
              <div className="app-section-head" onClick={() => toggleSection(cat.id)}>
                <div className="app-section-num">{cat.numero}</div>
                <div className="app-section-head-text">
                  <h2>{cat.nome}</h2>
                  <p>{cat.descricao}</p>
                </div>
                <div className="app-section-progress">
                  <div className="app-section-progress-text">
                    {catDone}/{effective} · {pct}%
                  </div>
                  <div className="app-section-progress-wrap">
                    <div className="app-section-progress-bar" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
                <div className="app-section-toggle">▼</div>
              </div>
              <div className="app-section-body">
                {cat.nota && <div className="app-section-note">{cat.nota}</div>}
                {renderItems}
                {visibleCount === 0 && (
                  <div className="app-empty-help">
                    Nenhum item desta seção corresponde aos filtros atuais.
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="app-actions">
        <div className="app-actions-title">Ações sobre o painel</div>
        <div className="app-actions-row">
          <button className="app-btn" onClick={expandAll}>
            Expandir todas
          </button>
          <button className="app-btn secondary" onClick={collapseAll}>
            Recolher todas
          </button>
        </div>
        <div className="app-actions-row">
          <button className="app-btn secondary" onClick={exportJSON}>
            Exportar JSON
          </button>
          <button className="app-btn secondary" onClick={exportCSV}>
            Exportar CSV
          </button>
          <button className="app-btn secondary" onClick={() => window.print()}>
            Imprimir
          </button>
        </div>
        <div className="app-actions-row">
          <button className="app-btn danger" onClick={resetAll}>
            Resetar marcações
          </button>
        </div>
      </div>

      <div className="app-footer-note">
        Painel produzido pela MTH Compliance · Conteúdo aderente ao texto do Edital nº 189/2026 ·
        Disciplina antifabricação do ecossistema MTH · Dados persistidos localmente e em nuvem ·
        Versão 5.0 — checklist genérico para qualquer OSC, com aderência estrita ao Edital nº
        189/2026 (22/05/2026)
      </div>

      <button
        className={cn('app-fab', showFab && 'show')}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Voltar ao topo"
      >
        ↑
      </button>
    </div>
  )
}
