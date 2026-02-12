
// interface MenuItem {
//     id: number;
//     name: string;
//     children?: MenuItem[];
// }

// interface MegaColumn {
//     colSpan: 3 | 6;
//     item: MenuItem;
// }

// export const buildMegaColumns = (
//     children: MenuItem[]
// ): MegaColumn[] => {
//     const columns: MegaColumn[] = [];

//     children.forEach((child) => {
//         const count = child.children?.length ?? 0;

//         columns.push({
//             item: child,
//             colSpan: count > 8 ? 6 : 3,
//         });
//     });

//     // Ensure total does not exceed 9 columns
//     let total = columns.reduce((sum, c) => sum + c.colSpan, 0);

//     if (total > 9) {
//         // downgrade extra cols to col-3
//         for (let i = 0; i < columns.length && total > 9; i++) {
//             if (columns[i].colSpan === 6) {
//                 columns[i].colSpan = 3;
//                 total -= 3;
//             }
//         }
//     }

//     return columns;
// };




interface MenuItem {
    id: number;
    name: string;
    children?: MenuItem[];
}

// interface MegaColumn {
//   colSpan: 3 | 6;
//   type: "section" | "simple";
//   item?: MenuItem;
//   items?: MenuItem[];
// }


interface MegaColumnsResult {
    fixedItems: MenuItem[];      // simple items (no children)
    sections: MenuItem[];        // items WITH children
}


// export const buildMegaColumns = (
//   children: MenuItem[]
// ): MegaColumn[] => {
//   const columns: MegaColumn[] = [];
//   const simpleItems: MenuItem[] = [];

//   children.forEach((child) => {
//     const hasThirdLevel = (child.children?.length ?? 0) > 0;

//     if (hasThirdLevel) {
//       const count = child.children!.length;

//       columns.push({
//         type: "section",
//         item: child,
//         colSpan: count > 8 ? 6 : 3,
//       });
//     } else {
//       simpleItems.push(child);
//     }
//   });

//   // If simple (no third level) items exist → group them
//   if (simpleItems.length > 0) {
//     columns.push({
//       type: "simple",
//       colSpan: 3,
//       items: simpleItems,
//     });
//   }

//   // Ensure total does not exceed 9 (12 - fixed 3)
//   let total = columns.reduce((sum, c) => sum + c.colSpan, 0);

//   if (total > 9) {
//     for (let i = 0; i < columns.length && total > 9; i++) {
//       if (columns[i].colSpan === 6) {
//         columns[i].colSpan = 3;
//         total -= 3;
//       }
//     }
//   }

//   return columns;
// };

export const buildMegaColumns = (
    children: MenuItem[]
): MegaColumnsResult => {
    const fixedItems: MenuItem[] = [];
    const sections: MenuItem[] = [];

    children.forEach((child, index) => {
        const hasThirdLevel = (child.children?.length ?? 0) > 0;

        // 🔴 RULE 1: index 0 is ALWAYS fixed
        if (index === 0) {
            fixedItems.push(child);
            return;
        }

        // 🔵 RULE 2: from index 1 onwards
        if (hasThirdLevel) {
            sections.push(child);
        } else {
            fixedItems.push(child);
        }
    });

    return {
        fixedItems,
        sections,
    };
};
