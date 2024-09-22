export function paginate<T>(items: T[], currentPage: number, itemsPerPage: number): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
}
  
export function getTotalPages(items: any[], itemsPerPage: number): number {
  return Math.ceil(items.length / itemsPerPage);
}
  