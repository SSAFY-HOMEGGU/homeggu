//interior/page.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog.jsx";
import { Input } from "@/app/components/ui/input.jsx";
import { Button } from "@/app/components/ui/button.jsx";
import { Label } from "@/app/components/ui/label.js";
import { ScrollArea } from "@/app/components/ui/scroll-area.js";
import useProjectStore from "./store/projectStore";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const { projects, createProject, loadProject, deleteProject } =
    useProjectStore();
  const [projectName, setProjectName] = React.useState("");
  const [isNewProjectOpen, setIsNewProjectOpen] = React.useState(false);
  const [isProjectListOpen, setIsProjectListOpen] = React.useState(false);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      const project = createProject(projectName.trim());
      if (project && project.id) {
        setProjectName("");
        setIsNewProjectOpen(false);
        toast.success("새 프로젝트가 생성되었습니다.");
        router.push(`/interior/${project.id}`);
      } else {
        toast.error("프로젝트 생성에 실패했습니다.");
      }
    }
  };

  const handleSelectProject = (project) => {
    if (project && project.id) {
      loadProject(project.id);
      setIsProjectListOpen(false);
      router.push(`/interior/${project.id}`);
    } else {
      toast.error("프로젝트를 불러올 수 없습니다.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create New Project Card */}
        <Dialog
          open={isNewProjectOpen}
          onOpenChange={(open) => {
            console.log("Dialog open state changed:", open); // 디버깅 로그
            setIsNewProjectOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <div className="group relative rounded-3xl bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer overflow-hidden h-[500px] flex items-center justify-center">
              <div className="text-center">
                <span className="text-gray-700 text-xl font-medium">
                  새 프로젝트 만들기
                </span>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 프로젝트 만들기</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <Label htmlFor="projectName">프로젝트 이름</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => {
                    console.log("Project name input:", e.target.value); // 디버깅 로그
                    setProjectName(e.target.value);
                  }}
                  placeholder="프로젝트 이름을 입력하세요"
                />
              </div>
              <Button type="submit" className="w-full">
                프로젝트 생성
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Projects List Card */}
        <Dialog
          open={isProjectListOpen}
          onOpenChange={(open) => {
            console.log("Project list dialog open state changed:", open); // 디버깅 로그
            setIsProjectListOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <div className="group relative rounded-3xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-colors cursor-pointer overflow-hidden h-[500px] flex items-center justify-center">
              <div className="text-center">
                <span className="text-gray-700 text-xl font-medium block">
                  저장된 프로젝트 보기
                </span>
                {projects.length > 0 && (
                  <span className="text-gray-500 text-sm mt-2 block">
                    {projects.length}개의 프로젝트
                  </span>
                )}
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>저장된 프로젝트</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full pr-4">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  저장된 프로젝트가 없습니다
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-lg border hover:border-blue-200 transition-colors cursor-pointer"
                      onClick={() => handleSelectProject(project)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-500">
                            마지막 수정:{" "}
                            {formatDistanceToNow(
                              new Date(project.lastModified),
                              { locale: ko }
                            )}{" "}
                            전
                          </p>
                          ;
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/interior/${project.id}`);
                              console.log("Editing project:", project.id); // 디버깅 로그
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Deleting project:", project.id); // 디버깅 로그
                              deleteProject(project.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
