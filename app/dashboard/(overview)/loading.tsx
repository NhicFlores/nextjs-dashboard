// loading at app/dashboard/
// fallback UI to show as replacement while page content loads 
// moved the loading.tsx and page.tsx into new (overview) folder so that 
// the dashboard skeleton only applies to the dashboard 
// using () in folder name keeps it from appearing in URL path 
// this allows you to create logical Route groups for organization without affecting 
// the URL path 
// can use route groups to separate app into sections: (marketing) routes, (shop) routes, or even into teams on large applications 
import DashboardSkeleton from "../../ui/skeletons";

export default function Loading() {
    return <DashboardSkeleton/>;
}