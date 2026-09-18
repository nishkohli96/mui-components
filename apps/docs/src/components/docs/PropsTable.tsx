import type { PropsInfo } from '@/types';
import { renderInlineMd } from '@/utils/inline-markdown';

type PropsTableProps = {
  /**
   * Table rows, one per component prop — compose them from
   * `componentProps` / `PropsDescription` in `constants/props-table`.
   */
  rows: PropsInfo[];
};

/**
 * API reference table for a component's props. Renders a plain server-side
 * `<table>` so it inherits the `.doc-article table` styles and stays fully
 * crawlable. Rows are typed `PropsInfo[]` maintained centrally, keeping prop
 * docs consistent across components and package versions.
 */
const PropsTable = ({ rows }: PropsTableProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          const anchorId = `prop-${row.name}`;
          return (
            <tr
              key={row.name}
              id={anchorId}
              style={{ scrollMarginTop: 90 }}
            >
              <td>
                <code>
                  {row.name}
                </code>
                {row.required && (
                  <span
                    aria-label="required"
                    style={{
                      color: 'var(--mui-palette-error-main)',
                      marginLeft: 2,
                      fontWeight: 700
                    }}
                  >
                    *
                  </span>
                )}
                <a
                  href={`#${anchorId}`}
                  className="prop-anchor"
                  aria-label={`Link to the ${row.name} prop`}
                />
              </td>
              <td>
                {row.hasLinkInType
                  ? renderInlineMd(row.type)
                  : (
                    <code>
                      {row.type}
                    </code>
                  )}
              </td>
              <td>
                {row.description.split('\n\n').map((paragraph, index) => (
                  <div key={index} style={index > 0 ? { marginTop: 6 } : undefined}>
                    {renderInlineMd(paragraph)}
                  </div>
                ))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PropsTable;
