'use client';
import * as React from 'react';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from '../ui/switch';
import useConfigStore from '@/store/config';
import { PasswordInput } from '../PasswordInput';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';
import { useThrottleFn } from 'ahooks';
import { useToast } from '../ui/use-toast';

export function Setting() {
    const { config, setConfig, resetGeneralConfig, setEditCodePermission } = useConfigStore()
    const { toast } = useToast()
    const [editCode, setEditCode] = React.useState(config.codeConfig.editCode)
    const { run: debounceSetEditCodePermission } = useThrottleFn(async () => {
        const hasEditCodePermission = await setEditCodePermission(editCode)
        if (hasEditCodePermission) {
            toast({
                title: "密码正确",
                description: "已获得编辑权限",
                duration: 1000
            })
            return
        } else {
            toast({
                variant: "destructive",
                title: "密码错误",
                description: "请检查密码是否正确",
                duration: 1000
            })
            return
        }
    }, { wait: 500 })
    const router = useRouter()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" suppressHydrationWarning>
                    <Settings size={20} className="rotate-0 scale-100 transition-all" />
                    <span className="sr-only">Settings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-68">
                <DialogHeader>
                    <DialogTitle>设置</DialogTitle>
                    <DialogDescription>
                        个性化设置
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between space-x-4">
                        <Label className="flex flex-col space-y-1">
                            <span>
                                显示标签
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                是否在笔记正文中显示标签
                            </span>
                        </Label>
                        <Switch checked={
                            config.generalConfig.isShowTags
                        } onCheckedChange={(checked) => {
                            setConfig(config => {
                                debugger
                                config.generalConfig.isShowTags = checked
                                return config
                            })
                        }} />
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                        <Label className="flex flex-col space-y-1">
                            <span>
                                分享卡片显示标签
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                分享卡片默认是否显示标签
                            </span>
                        </Label>
                        <Switch checked={
                            config.generalConfig.isShowTagsInShareCard
                        } onCheckedChange={(checked) => {
                            setConfig(config => {
                                config.generalConfig.isShowTagsInShareCard = checked
                            })
                        }} />
                    </div>
                    <Button type="reset" className="w-full" variant="destructive" onClick={resetGeneralConfig}>
                        重置设置
                    </Button>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                        <Label className="flex flex-col space-y-1 ">
                            <span>
                                访问密码
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                如果设置了访问密码，只有输入密码才能查看笔记
                            </span>
                        </Label>
                        <PasswordInput disabled className="w-full  " value={config.codeConfig.accessCode} />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex flex-col space-y-1 ">
                            <span>
                                编辑密码
                            </span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">
                                如果设置了编辑密码，只有输入密码才能编辑笔记
                            </span>
                        </Label>
                        <PasswordInput className="w-full" value={editCode} onChange={(e) => {
                            setEditCode(e.target.value)
                        }} />
                    </div>
                    <Button type="submit" className="w-full" onClick={debounceSetEditCodePermission}>
                        校验编辑密码
                    </Button>
                    <Button type="submit" className="w-full" variant="destructive" onClick={() => {
                        resetGeneralConfig()
                        router.push('/login')
                    }}>
                        重置密码
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
